<?php
/**
 * Plugin Name: Sensay Simple Chat (Proxy)
 * Description: Minimal Sensay chat plugin: provisioning (master user + single replica), member/guest user management, REST bootstrap & chat proxy, a tiny frontend widget, and admin pages (Dashboard + Training).
 * Version: 0.4.1
 * Author: You
 */

if (!defined('ABSPATH')) exit;

/** ─────────────────────────────────────────────────────────
 *  1) CONSTANTS
 *  ───────────────────────────────────────────────────────── */
if (!defined('SENSAY_ORG_SECRET')) define('SENSAY_ORG_SECRET', '8fa5d504c1ebe6f17436c72dd602d3017a4fe390eb5963e38a1999675c9c7ad3');
if (!defined('SENSAY_API_VERSION')) define('SENSAY_API_VERSION', '2025-03-25');
if (!defined('SENSAY_API_BASE'))    define('SENSAY_API_BASE',    'https://api.sensay.io');

if (!defined('SENSAY_COOKIE_NAME')) define('SENSAY_COOKIE_NAME', 'sensay_uid');
if (!defined('SENSAY_COOKIE_TTL'))  define('SENSAY_COOKIE_TTL', 60 * 60 * 24 * 30); // 30d

/** ─────────────────────────────────────────────────────────
 *  2) GENERIC HELPERS
 *  ───────────────────────────────────────────────────────── */
function sensay_api_post($path, $body) {
  $url = trailingslashit(SENSAY_API_BASE) . ltrim($path, '/');
  $res = wp_remote_post($url, [
    'method'  => 'POST',
    'headers' => [
      'Content-Type'           => 'application/json',
      'X-ORGANIZATION-SECRET'  => SENSAY_ORG_SECRET,
      'X-API-Version'          => SENSAY_API_VERSION,
    ],
    'timeout' => 30,
    'body'    => wp_json_encode($body),
  ]);
  if (is_wp_error($res)) return $res;
  return [
    'code' => wp_remote_retrieve_response_code($res),
    'body' => json_decode(wp_remote_retrieve_body($res), true),
  ];
}

function sensay_api_get($path, $query = []) {
  $url = trailingslashit(SENSAY_API_BASE) . ltrim($path, '/');
  if (!empty($query)) $url = add_query_arg($query, $url);
  $res = wp_remote_get($url, [
    'timeout' => 30,
    'headers' => [
      'Accept'                => 'application/json',
      'X-ORGANIZATION-SECRET' => SENSAY_ORG_SECRET,
      'X-API-Version'         => SENSAY_API_VERSION,
    ],
  ]);
  if (is_wp_error($res)) return $res;
  return [
    'code' => wp_remote_retrieve_response_code($res),
    'body' => json_decode(wp_remote_retrieve_body($res), true),
  ];
}

function sensay_api_delete($path) {
  $url = trailingslashit(SENSAY_API_BASE) . ltrim($path, '/');
  $res = wp_remote_request($url, [
    'method'  => 'DELETE',
    'timeout' => 30,
    'headers' => [
      'Accept'                => 'application/json',
      'X-ORGANIZATION-SECRET' => SENSAY_ORG_SECRET,
      'X-API-Version'         => SENSAY_API_VERSION,
    ],
  ]);
  if (is_wp_error($res)) return $res;
  return [
    'code' => wp_remote_retrieve_response_code($res),
    'body' => json_decode(wp_remote_retrieve_body($res), true),
  ];
}

function sensay_get_site_fingerprint() {
  $site_url = untrailingslashit(get_site_url());
  return substr(hash('sha256', $site_url), 0, 24);
}

function sensay_update_last_error($msg) {
  update_option('sensay_last_error', $msg, false);
}

add_action('admin_notices', function() {
  $err = get_option('sensay_last_error');
  if ($err) {
    echo '<div class="notice notice-error is-dismissible"><p><strong>Sensay:</strong> ' . esc_html($err) . '</p></div>';
  }
});

/** ─────────────────────────────────────────────────────────
 *  2.1) INTERNAL → EXTERNAL UID DÖNÜŞTÜRÜCÜ
 *  ───────────────────────────────────────────────────────── */
function sensay_external_uid($internal_id) {
  $fp = sensay_get_site_fingerprint();

  // master → <fp>
  if (preg_match('/^wp\-'.preg_quote($fp,'/').'\-master$/', $internal_id)) {
    return $fp;
  }

  // member → <fp>-m<wpId>
  if (preg_match('/^wp\-'.preg_quote($fp,'/').'\-member\-(\d+)$/', $internal_id, $m)) {
    return $fp . '-m' . $m[1];
  }

  // guest → <fp>-g<tok>
  if (preg_match('/^wp\-'.preg_quote($fp,'/').'\-guest\-([a-f0-9]+)$/', $internal_id, $m)) {
    return $fp . '-g' . $m[1];
  }

  // bilinmeyen iç format: <fp>-x<short>
  return $fp . '-x' . substr(hash('sha256', $internal_id), 0, 6);
}

/** ─────────────────────────────────────────────────────────
 *  3) MASTER USER (site başına tek) – idempotent
 *  ───────────────────────────────────────────────────────── */
function sensay_provision_master_user() {
  $existing = get_option('sensay_master_user_id'); // DAİMA internal format
  if (!empty($existing)) return $existing;

  $fingerprint = sensay_get_site_fingerprint();
  $admin_email = get_option('admin_email') ?: null;
  $site_name   = get_bloginfo('name') ?: 'My Site';

  // içeride tutulacak internal id
  $internal_master_id = 'wp-' . $fingerprint . '-master';

  // API'ye gidecek external id
  $payload = [
    'name'  => $site_name . ' Master',
    'email' => $admin_email,
    'id'    => sensay_external_uid($internal_master_id),
    'linkedAccounts' => []
  ];

  $res = sensay_api_post('/v1/users', $payload);
  if (is_wp_error($res)) {
    sensay_update_last_error('Master user API error: ' . $res->get_error_message());
    return new WP_Error('sensay_user_err', $res->get_error_message());
  }

  // sonuç ne olursa olsun internal id'yi kaydet
  update_option('sensay_master_user_id', $internal_master_id, false);
  return $internal_master_id;
}

/** ─────────────────────────────────────────────────────────
 *  4) REPLICA (site başına tek) – dil + slug (site adına göre)
 *  ───────────────────────────────────────────────────────── */
function sensay_provision_replica($owner_internal_id) {
  $existing = get_option('sensay_replica_id');
  if (!empty($existing)) return $existing;

  $lang = 'en';

  $greetings = [
    'en' => 'Hello! I can help you with product fit, orders, shipping, returns, or pricing questions. How can I assist you today?',
    'de' => 'Hallo! Ich helfe Ihnen gerne bei Fragen zu Produkten, Bestellungen, Versand, Rücksendungen oder Preisen. Wie kann ich Ihnen heute weiterhelfen?',
    'fr' => 'Bonjour ! Je peux vous aider concernant la compatibilité des produits, vos commandes, la livraison, les retours ou les prix. Comment puis-je vous aider aujourd’hui ?',
    'it' => 'Ciao! Posso aiutarti con domande su compatibilità dei prodotti, ordini, spedizioni, resi o prezzi. Come posso aiutarti oggi?',
    'es' => '¡Hola! Puedo ayudarte con la compatibilidad de productos, pedidos, envíos, devoluciones o precios. ¿En qué puedo ayudarte hoy?',
    'pl' => 'Cześć! Mogę pomóc w dopasowaniu produktu, zamówieniach, wysyłce, zwrotach lub pytaniach o ceny. Jak mogę ci dziś pomóc?',
    'nl' => 'Hallo! Ik kan je helpen met productgeschiktheid, bestellingen, verzending, retouren of prijsinformatie. Waarmee kan ik je vandaag helpen?',
    'tr' => 'Merhaba! Ürün uyumluluğu, siparişler, kargo, iade veya fiyat sorularınızda yardımcı olabilirim. Size nasıl yardımcı olabilirim?'
  ];

  $suggested = [
    'en' => ['When will my order arrive?','Is this the right size for my car?','How can I return or exchange an item?','What is the current price and availability?','Can I get an invoice for my order?'],
    'de' => ['Wann kommt meine Bestellung an?','Ist dies die richtige Größe für mein Auto?','Wie kann ich einen Artikel zurückgeben oder umtauschen?','Wie sind Preis und Verfügbarkeit?','Kann ich eine Rechnung für meine Bestellung erhalten?'],
    'fr' => ['Quand ma commande arrivera-t-elle ?','Est-ce la bonne taille pour ma voiture ?','Comment puis-je retourner ou échanger un article ?','Quel est le prix et la disponibilité actuels ?','Puis-je obtenir une facture pour ma commande ?'],
    'it' => ['Quando arriverà il mio ordine?','È la misura giusta pour ma auto?','Come posso restituire o cambiare un articolo?','Qual è il prezzo e la disponibilità attuali?','Posso ricevere la fattura del mio ordine?'],
    'es' => ['¿Cuándo llegará mi pedido?','¿Es esta la medida correcta para mi coche?','¿Cómo puedo devolver o cambiar un artículo?','¿Cuál es el precio y la disponibilidad actuales?','¿Puedo obtener la factura de mi pedido?'],
    'pl' => ['Kiedy dotrze moje zamówienie?','Czy to jest odpowiedni rozmiar dla mojego auta?','Jak mogę zwrócić lub wymienić produkt?','Jaka jest aktualna cena i dostępność?','Czy mogę otrzymać fakturę za moje zamówienie?'],
    'nl' => ['Wanneer komt mijn bestelling aan?','Is dit de juiste maat voor mijn auto?','Hoe kan ik een artikel retourneren of ruilen?','Wat is de huidige prijs en beschikbaarheid?','Kan ik een factuur voor mijn bestelling krijgen?'],
    'tr' => ['Kargom ne zaman gelir?','Aracım için doğru ebat bu mu?','Nasıl iade veya değişim yapabilirim?','Fiyat ve stok durumu nedir?','Siparişime fatura ekleyebilir miyim?']
  ];

  $site_name = get_bloginfo('name') ?: 'site';
  $prefix    = strtolower( sanitize_title( $site_name ) );
  $slug      = trim($prefix ? $prefix . '-store-support-assistant' : 'store-support-assistant');

  $payload = [
    'name'             => 'Store Support Assistant',
    'purpose'          => 'Provide customer support for this website, answering questions about products, orders, shipping, returns, and general FAQs.',
    'shortDescription' => 'Multilingual support agent for this store.',
    'greeting'         => $greetings[$lang],
    'type'             => 'character',
    'ownerID'          => sensay_external_uid($owner_internal_id), // internal → external
    'private'          => false,
    'whitelistEmails'  => [],
    'slug'             => $slug,
    'tags'             => ['support','ecommerce','multilingual','faq'],
    'profileImage'     => 'https://images.invalid/photo.jpeg',
    'suggestedQuestions'=> $suggested[$lang],
    'llm' => [
      'model'        => 'gpt-4o',
      'memoryMode'   => 'rag-search',
      'systemMessage'=> 'You are the official customer support assistant for this website. Be concise, accurate, and friendly. If asked about orders or tracking, request an order number or email. If policies or pricing may vary by country, ask for the user’s country first. Never fabricate data; if unsure, say so and propose next steps. Use bullet points for multi-step instructions. Auto-detect and respond in the user’s language (EN/DE/FR/IT/ES/PL/NL/TR). Do not expose private keys, admin info, or internal endpoints. Tone: professional, warm, solution-oriented.',
      'tools'        => []
    ],
    'voicePreviewText'                       => 'Hi! I can help with orders, shipping, returns, and product fit.',
    'isAccessibleByCustomerSupport'          => true,
    'isEveryConversationAccessibleBySupport' => true,
    'isPrivateConversationsEnabled'          => false
  ];

  $res = sensay_api_post('/v1/replicas', $payload);
  if (is_wp_error($res)) {
    sensay_update_last_error('Replica API error: ' . $res->get_error_message());
    return new WP_Error('sensay_replica_err', $res->get_error_message());
  }

  if (in_array($res['code'], [200, 201], true)) {
    $replica_id = $res['body']['id'] ?? $res['body']['uuid'] ?? null;
    if (!empty($replica_id)) {
      update_option('sensay_replica_id', $replica_id, false);
      return $replica_id;
    }
  }

  $msg = 'Unexpected replica response: ' . $res['code'] . ' ' . wp_json_encode($res['body']);
  sensay_update_last_error($msg);
  return new WP_Error('sensay_replica_http', $msg);
}

/** ─────────────────────────────────────────────────────────
 *  5) ACTIVATION – master + replica provisioning
 *  ───────────────────────────────────────────────────────── */
register_activation_hook(__FILE__, function () {
  delete_option('sensay_last_error');
  $master_internal_id = sensay_provision_master_user();
  if (is_wp_error($master_internal_id)) return;
  sensay_provision_replica($master_internal_id);
});

/** ─────────────────────────────────────────────────────────
 *  6) COOKIE & USER HELPERS
 *  ───────────────────────────────────────────────────────── */
function sensay_set_cookie($value, $ttl = SENSAY_COOKIE_TTL) {
  setcookie(SENSAY_COOKIE_NAME, $value, time() + $ttl, COOKIEPATH, COOKIE_DOMAIN, is_ssl(), true);
  $_COOKIE[SENSAY_COOKIE_NAME] = $value;
}
function sensay_get_cookie() {
  return !empty($_COOKIE[SENSAY_COOKIE_NAME]) ? sanitize_text_field($_COOKIE[SENSAY_COOKIE_NAME]) : null;
}

function sensay_uid_for_member($wp_user_id) {
  return 'wp-' . sensay_get_site_fingerprint() . '-member-' . intval($wp_user_id);
}
function sensay_uid_new_guest() {
  return 'wp-' . sensay_get_site_fingerprint() . '-guest-' . substr(wp_generate_uuid4(), 0, 8);
}
function sensay_upsert_user($internal_id, $name = null, $email = null, $linked = []) {
  $payload = [
    'name'  => $name,
    'email' => $email,
    'id'    => sensay_external_uid($internal_id), // API'ye her zaman external
    'linkedAccounts' => $linked
  ];
  return sensay_api_post('/v1/users', $payload); // expect 200 or 409
}

/** ─────────────────────────────────────────────────────────
 *  7) GUEST USER (cookie-based)
 *  ───────────────────────────────────────────────────────── */
function sensay_get_or_create_guest_user() {
  $existing = sensay_get_cookie();
  if ($existing) return $existing;

  $uid = sensay_uid_new_guest();
  $linked = [];
  sensay_upsert_user($uid, 'Visitor', null, $linked); // fail-soft
  sensay_set_cookie($uid);
  return $uid;
}

/** ─────────────────────────────────────────────────────────
 *  8) MEMBER USER (user meta; guest→member promote)
 *  ───────────────────────────────────────────────────────── */
function sensay_get_or_create_member_user($wp_user) {
  $meta_key = 'sensay_user_id';
  $saved    = get_user_meta($wp_user->ID, $meta_key, true);
  if (!empty($saved)) {
    sensay_set_cookie($saved, 60*60*24*365);
    return $saved;
  }

  // Promote guest if exists
  $guest_uid = sensay_get_cookie();
  if ($guest_uid) {
    $linked = [];
    sensay_upsert_user(
      $guest_uid,
      trim($wp_user->display_name ?: ($wp_user->first_name . ' ' . $wp_user->last_name)) ?: 'Member',
      $wp_user->user_email ?: null,
      $linked
    );
    update_user_meta($wp_user->ID, $meta_key, $guest_uid);
    sensay_set_cookie($guest_uid, 60*60*24*365);
    return $guest_uid;
  }

  // New deterministic member uid (internal)
  $member_uid = sensay_uid_for_member($wp_user->ID);
  $linked = [];
  sensay_upsert_user(
    $member_uid,
    trim($wp_user->display_name ?: ($wp_user->first_name . ' ' . $wp_user->last_name)) ?: 'Member',
    $wp_user->user_email ?: null,
    $linked
  );
  update_user_meta($wp_user->ID, $meta_key, $member_uid);
  sensay_set_cookie($member_uid, 60*60*24*365);
  return $member_uid;
}

// Auto-promote on register/login
add_action('user_register', function ($user_id) {
  $u = get_user_by('id', $user_id);
  if ($u) sensay_get_or_create_member_user($u);
}, 10, 1);
add_action('wp_login', function ($user_login, $user) {
  sensay_get_or_create_member_user($user);
}, 10, 2);

/** ─────────────────────────────────────────────────────────
 *  9) LOAD RUNTIME CONSTANTS (replica/master)
 *  ───────────────────────────────────────────────────────── */
add_action('plugins_loaded', function () {
  $rid = get_option('sensay_replica_id');
  if ($rid && !defined('SENSAY_REPLICA_ID')) define('SENSAY_REPLICA_ID', $rid);
  $mid = get_option('sensay_master_user_id'); // internal id
  if ($mid && !defined('SENSAY_MASTER_USER_ID')) define('SENSAY_MASTER_USER_ID', $mid);
});

/** ─────────────────────────────────────────────────────────
 *  10) REST – Bootstrap / Chat / History
 *  ───────────────────────────────────────────────────────── */
add_action('rest_api_init', function () {

  // Bootstrap → { replicaId, sensayUserId }  (sensayUserId = internal)
  register_rest_route('sensay/v1', '/bootstrap', [
    'methods'  => 'GET',
    'permission_callback' => '__return_true',
    'callback' => function () {
      $rid = get_option('sensay_replica_id');
      if (!$rid) {
        $master_id = sensay_provision_master_user();
        if (!is_wp_error($master_id)) $rid = sensay_provision_replica($master_id);
      }
      $uid = is_user_logged_in()
        ? sensay_get_or_create_member_user(wp_get_current_user())
        : sensay_get_or_create_guest_user();

      if (is_wp_error($uid)) {
        return new WP_REST_Response(['error' => $uid->get_error_message()], 500);
      }
      return new WP_REST_Response([
        'replicaId'    => get_option('sensay_replica_id'),
        'sensayUserId' => $uid, // internal döner
      ], 200);
    }
  ]);

  // Chat proxy (uses current internal sensay user id)
  register_rest_route('sensay/v1', '/chat', [
    'methods'  => 'POST',
    'permission_callback' => '__return_true',
    'callback' => function (WP_REST_Request $req) {
      $replica_id = get_option('sensay_replica_id');
      if (empty(SENSAY_ORG_SECRET) || empty($replica_id)) {
        return new WP_REST_Response(['ok'=>false,'error'=>'Server not configured.'], 500);
      }
      $content = trim((string)$req->get_param('content'));
      if ($content === '') return new WP_REST_Response(['ok'=>false,'error'=>'content is required'], 400);

      $internal_user_id = is_user_logged_in()
        ? sensay_get_or_create_member_user(wp_get_current_user())
        : sensay_get_or_create_guest_user();
      if (is_wp_error($internal_user_id)) {
        return new WP_REST_Response(['ok'=>false,'error'=>$internal_user_id->get_error_message()], 500);
      }

      $endpoint = trailingslashit(SENSAY_API_BASE) . 'v1/replicas/' . rawurlencode($replica_id) . '/chat/completions';
      $res = wp_remote_post($endpoint, [
        'timeout' => 30,
        'headers' => [
          'X-ORGANIZATION-SECRET' => SENSAY_ORG_SECRET,
          'X-API-Version'         => SENSAY_API_VERSION,
          'X-USER-ID'             => sensay_external_uid($internal_user_id), // external header
          'Content-Type'          => 'application/json',
          'Accept'                => 'application/json',
        ],
        'body'    => wp_json_encode(['content' => $content]),
      ]);
      if (is_wp_error($res)) {
        return new WP_REST_Response(['ok'=>false,'error'=>$res->get_error_message()], 500);
      }

      $code = wp_remote_retrieve_response_code($res);
      $raw  = wp_remote_retrieve_body($res);
      $data = json_decode($raw, true);

      if ($code < 200 || $code >= 300) {
        $msg = is_array($data) ? ($data['error'] ?? $data['message'] ?? $raw) : $raw;
        return new WP_REST_Response(['ok'=>false,'error'=>$msg,'raw'=>$data], $code);
      }

      $text = '';
      if (isset($data['content']) && is_string($data['content'])) $text = $data['content'];
      elseif (isset($data['response']['content'])) $text = (string)$data['response']['content'];
      else $text = is_string($raw) ? $raw : json_encode($data, JSON_UNESCAPED_UNICODE);

      return new WP_REST_Response(['ok'=>true,'reply'=>$text], 200);
    }
  ]);

  // History proxy (simple pass-through)
  register_rest_route('sensay/v1', '/history', [
    'methods'  => 'GET',
    'permission_callback' => '__return_true',
    'callback' => function (WP_REST_Request $req) {
      if (empty(SENSAY_ORG_SECRET)) {
        return new WP_REST_Response(['ok'=>false,'error'=>'Server not configured.'], 500);
      }

      $replica_id = sanitize_text_field((string)($req->get_param('replica_id') ?: get_option('sensay_replica_id')));
      // client user_id (internal) yoksa current internal
      $user_id_param = $req->get_param('user_id');
      if ($user_id_param) {
        $internal_user_id = sanitize_text_field((string)$user_id_param);
      } else {
        $internal_user_id = is_user_logged_in()
          ? sensay_get_or_create_member_user(wp_get_current_user())
          : sensay_get_or_create_guest_user();
      }

      if (!$replica_id || !$internal_user_id) {
        return new WP_REST_Response(['ok'=>false,'error'=>'replica_id and user_id are required'], 400);
      }

      $limit  = max(1, min(200, (int)($req->get_param('limit') ?: 30)));
      $cursor = sanitize_text_field((string)($req->get_param('cursor') ?: ''));
      $start  = sanitize_text_field((string)($req->get_param('start')  ?: ''));
      $end    = sanitize_text_field((string)($req->get_param('end')    ?: ''));

      $query = ['limit' => $limit];
      if ($cursor !== '') $query['cursor'] = $cursor;
      if ($start  !== '') $query['start']  = $start;
      if ($end    !== '') $query['end']    = $end;

      $url = add_query_arg($query,
        trailingslashit(SENSAY_API_BASE) . 'v1/replicas/' . rawurlencode($replica_id) . '/chat/history'
      );

      $res = wp_remote_get($url, [
        'timeout' => 30,
        'headers' => [
          'X-ORGANIZATION-SECRET' => SENSAY_ORG_SECRET,
          'X-API-Version'         => SENSAY_API_VERSION,
          'X-USER-ID'             => sensay_external_uid($internal_user_id), // external header
          'Accept'                => 'application/json',
        ],
      ]);
      if (is_wp_error($res)) {
        return new WP_REST_Response(['ok'=>false,'error'=>$res->get_error_message()], 500);
      }

      $code = wp_remote_retrieve_response_code($res);
      $raw  = wp_remote_retrieve_body($res);
      $data = json_decode($raw, true);

      if ($code < 200 || $code >= 300) {
        return new WP_REST_Response(['ok'=>false,'error'=>($data['error'] ?? $raw)], $code);
      }
      return new WP_REST_Response($data, 200);
    }
  ]);
});

/** ─────────────────────────────────────────────────────────
 *  11) ADMIN MENU: Chatbot + Training
 *  ───────────────────────────────────────────────────────── */
add_action('admin_menu', function(){
  add_menu_page(
    'Chatbot',
    'Chatbot',
    'manage_options',
    'sensay-chatbot',
    'sensay_chatbot_dashboard_page',
    'dashicons-format-chat',
    58
  );

  add_submenu_page(
    'sensay-chatbot',
    'Training',
    'Training',
    'manage_options',
    'sensay-chatbot-training',
    'sensay_chatbot_train_page'
  );
});

/** Admin Dashboard page */
function sensay_chatbot_dashboard_page(){
  if (!current_user_can('manage_options')) return;
  echo '<div class="wrap"><h1>Chatbot</h1>';
  echo '<p>Manage your chatbot settings and training data from this dashboard.</p>';
  echo '<p><a class="button button-primary" href="' . esc_url(admin_url('admin.php?page=sensay-chatbot-training')) . '">Go to Training Page</a></p>';
  echo '</div>';
}

/** ─────────────────────────────────────────────────────────
 *  12) TRAINING HELPERS (signed URL, upload, list, delete, details)
 *  ───────────────────────────────────────────────────────── */
function sensay_get_signed_url($filename) {
  $rid = get_option('sensay_replica_id');
  if (empty(SENSAY_ORG_SECRET) || empty($rid)) {
    return ['success' => false, 'error' => 'API settings are missing.'];
  }
  $path = '/v1/replicas/' . rawurlencode($rid) . '/training/files/upload';
  $res  = sensay_api_get($path, ['filename' => $filename]);
  if (is_wp_error($res)) return ['success'=>false,'error'=>$res->get_error_message()];
  if ($res['code'] >= 200 && $res['code'] < 300) {
    if (!empty($res['body']['signedUrl']) || !empty($res['body']['signedURL'])) {
      return ['success'=>true, 'signedUrl' => $res['body']['signedUrl'] ?? $res['body']['signedURL']];
    }
    return ['success'=>false,'error'=>'No signed URL returned.'];
  }
  return ['success'=>false,'error'=> ($res['body']['error'] ?? 'Failed to get signed URL.')];
}

function sensay_upload_file($signed_url, $file_path, $mime_type = 'application/octet-stream') {
  if (!file_exists($file_path)) return ['success'=>false,'error'=>'File not found.'];
  $args = [
    'method'      => 'PUT',
    'timeout'     => 60,
    'headers'     => [
      'Content-Type'   => $mime_type,
      'Content-Length' => filesize($file_path),
    ],
    'body'        => file_get_contents($file_path),
    'data_format' => 'body',
  ];
  $res = wp_remote_request($signed_url, $args);
  if (is_wp_error($res)) return ['success'=>false,'error'=>$res->get_error_message()];
  $code = wp_remote_retrieve_response_code($res);
  return ($code >= 200 && $code < 300) ? ['success'=>true] : ['success'=>false,'error'=>'Upload failed: '.$code];
}

function sensay_get_training_documents() {
  $res = sensay_api_get('/v1/training');
  if (is_wp_error($res)) return ['success'=>false,'error'=>$res->get_error_message()];
  return $res['body'];
}

function sensay_delete_training_document($file_id) {
  if (empty($file_id)) return ['success'=>false,'error'=>'Invalid file id.'];
  $res = sensay_api_delete('/v1/training/' . rawurlencode($file_id));
  if (is_wp_error($res)) return ['success'=>false,'error'=>$res->get_error_message()];
  if ($res['code'] === 204) return ['success'=>true];
  if ($res['code'] === 200 && !empty($res['body']['success'])) return ['success'=>true];
  return ['success'=>false,'error'=>($res['body']['error'] ?? 'Delete failed: '.$res['code'])];
}

function sensay_get_document_details($document_id) {
  if (empty($document_id)) return ['success'=>false,'error'=>'No document ID provided'];
  $res = sensay_api_get('/v1/training/' . rawurlencode($document_id));
  if (is_wp_error($res)) return ['success'=>false,'error'=>$res->get_error_message()];
  $data = $res['body'];
  if (empty($data) || empty($data['success'])) {
    return ['success'=>false,'error'=>($data['error'] ?? 'Failed to fetch document details')];
  }
  return $data;
}

// AJAX: delete training document
add_action('wp_ajax_sensay_delete_document', function() {
  if (!current_user_can('manage_options')) wp_send_json_error('Unauthorized', 403);
  check_ajax_referer('sensay_training_nonce');
  $document_id = sanitize_text_field($_POST['document_id'] ?? '');
  if (!$document_id) wp_send_json_error('Document ID is missing.');

  $details = sensay_get_document_details($document_id);
  $current_replica = get_option('sensay_replica_id');
  $detail_replica  = $details['replica_uuid'] ?? $details['replicaId'] ?? null;
  if (empty($details['success']) || !$detail_replica || $detail_replica !== $current_replica) {
    wp_send_json_error('This document does not belong to this replica.', 403);
  }

  $result = sensay_delete_training_document($document_id);
  if (!empty($result['success'])) {
    wp_send_json_success();
  } else {
    wp_send_json(['success'=>false,'error'=>$result['error'] ?? 'Delete error']);
  }
});

// AJAX: get document details
add_action('wp_ajax_sensay_get_document_details', function() {
  if (!current_user_can('manage_options')) wp_send_json_error('Unauthorized', 403);
  $document_id = sanitize_text_field($_GET['document_id'] ?? '');
  if (!$document_id) wp_send_json_error('Document ID is required', 400);
  $details = sensay_get_document_details($document_id);
  if (empty($details['success'])) wp_send_json_error($details['error'] ?? 'Failed to fetch', 500);

  $response = [
    'filename'   => $details['filename'] ?? 'N/A',
    'created_at' => !empty($details['created_at']) ? date('Y-m-d H:i', strtotime($details['created_at'])) : 'N/A',
    'status'     => $details['status'] ?? 'N/A',
    'raw_text'   => $details['raw_text'] ?? 'No content',
    'type'       => $details['type'] ?? 'N/A'
  ];
  wp_send_json_success($response);
});

/** ─────────────────────────────────────────────────────────
 *  13) TRAINING PAGE (UI)
 *  ───────────────────────────────────────────────────────── */
function sensay_chatbot_train_page(){

  $internal_user_id = is_user_logged_in()
  ? sensay_get_or_create_member_user(wp_get_current_user())
  : sensay_get_or_create_guest_user();

  echo sensay_external_uid($internal_user_id);


  if (!current_user_can('manage_options')) return;

  // Upload handler
  $message = ''; $message_class = 'notice';
  if (isset($_FILES['training_file']) && !empty($_FILES['training_file']['name'])) {
    check_admin_referer('sensay_upload_document','sensay_upload_nonce');

    $file      = $_FILES['training_file'];
    $filename  = sanitize_file_name($file['name']);
    $file_tmp  = $file['tmp_name'];
    $mime_type = $file['type'] ?: 'application/octet-stream';

    $signed = sensay_get_signed_url($filename);
    if (!empty($signed['success'])) {
      $up = sensay_upload_file($signed['signedUrl'], $file_tmp, $mime_type);
      if (!empty($up['success'])) {
        $message = 'File uploaded. It will be processed shortly.';
        $message_class = 'notice-success';
      } else {
        $message = 'Upload failed: ' . ($up['error'] ?? 'Unknown');
        $message_class = 'notice-error';
      }
    } else {
      $message = 'Could not get signed URL: ' . ($signed['error'] ?? 'Unknown');
      $message_class = 'notice-error';
    }
  }

  // Fetch documents
  $training_documents = [];
  $training_response = sensay_get_training_documents();
  if (is_array($training_response) && !empty($training_response['success'])) {
    if (!empty($training_response['items']))       $training_documents = $training_response['items'];
    elseif (!empty($training_response['data']))    $training_documents = $training_response['data'];
  }

  $current_replica = get_option('sensay_replica_id');
  if ($current_replica && is_array($training_documents)) {
    $training_documents = array_values(array_filter($training_documents, function($doc) use ($current_replica) {
      $rid = $doc['replica_uuid'] ?? $doc['replicaId'] ?? null;
      return $rid && $rid === $current_replica;
    }));
  }

  echo '<div class="wrap">';
  echo '<h1 class="wp-heading-inline">Training</h1><hr class="wp-header-end">';

  if (!empty($message)) {
    echo '<div class="notice ' . esc_attr($message_class) . ' is-dismissible"><p>' . esc_html($message) . '</p></div>';
  }

  $current_tab = isset($_GET['tab']) ? sanitize_text_field($_GET['tab']) : 'training';
  $tabs = ['training'=>'Training Documents','import-pages'=>'Import Pages','import-menus'=>'Import Menus'];
  echo '<h2 class="nav-tab-wrapper">';
  foreach ($tabs as $k=>$label) {
    $cls = $current_tab===$k ? ' nav-tab-active' : '';
    echo '<a href="'.esc_url(add_query_arg('tab',$k)).'" class="nav-tab'.$cls.'">'.$label.'</a>';
  }
  echo '</h2>';

  if ($current_tab==='training') {
    ?>
    <div class="card" style="max-width:1200px;">
      <h2>Upload New Document</h2>
      <form method="post" enctype="multipart/form-data" class="sensay-upload-form">
        <?php wp_nonce_field('sensay_upload_document','sensay_upload_nonce'); ?>
        <div class="sensay-upload-area" id="drag-drop-area">
          <div class="upload-icon">⬆️</div>
          <h3>Drag & drop your file here</h3>
          <p class="upload-hint">or <span class="browse-link">browse files</span></p>
          <p class="file-types">Supported formats: PDF, DOCX, TXT (Max: 25MB)</p>
          <input type="file" name="training_file" id="training_file" class="file-input" accept=".pdf,.docx,.txt" required>
          <div class="file-info" id="file-info" style="display:none;">
            <div class="file-preview">
              <div class="file-details">
                <div class="file-name" id="file-name"></div>
                <div class="file-size" id="file-size"></div>
              </div>
              <button type="button" class="button-link-delete remove-file" id="remove-file">Remove</button>
            </div>
          </div>
        </div>
        <p class="submit">
          <button type="submit" class="button button-primary" id="upload-button" disabled>Upload</button>
        </p>
      </form>
    </div>

    <div class="card">
      <h2>Training Documents</h2>
      <?php if (!empty($training_documents)) : ?>
        <table id="training-documents" class="wp-list-table widefat fixed striped">
          <thead><tr><th>Title</th><th>Type</th><th>Status</th><th>Created At</th><th>Actions</th></tr></thead>
          <tbody>
          <?php foreach ($training_documents as $doc) {
            $rid = $doc['replica_uuid'] ?? $doc['replicaId'] ?? null;
            if ($rid !== get_option('sensay_replica_id')) { continue; }
            $file_id  = $doc['id'] ?? $doc['fileId'] ?? '';
            $title    = $doc['filename'] ?? $doc['name'] ?? 'Untitled';
            $raw_type = $doc['type'] ?? $doc['fileType'] ?? 'unknown';
            $type     = $raw_type === 'file_upload' ? 'File' : ($raw_type === 'text' ? 'Text' : $raw_type);
            $status   = $doc['status'] ?? 'unknown';
            $status_text = match($status) {
              'AWAITING_UPLOAD' => 'Processing 1/4',
              'FILE_UPLOADED'   => 'Processing 2/4',
              'VECTOR_CREATED'  => 'Processing 3/4',
              'READY'           => 'Ready',
              default           => $status
            };
            $created = !empty($doc['created_at']) ? esc_html(date('Y-m-d H:i', strtotime($doc['created_at']))) : 'N/A';
            echo '<tr data-doc-id="'.esc_attr($file_id).'">';
            echo '<td>'.esc_html($title).'</td>';
            echo '<td>'.esc_html($type).'</td>';
            echo '<td><span class="status-badge">'.esc_html($status_text).'</span></td>';
            echo '<td>'.$created.'</td>';
            echo '<td>';
            echo '<button class="button button-small view-document" data-doc-id="'.esc_attr($file_id).'">View</button> ';
            echo '<button class="button button-small button-link-delete delete-document" data-doc-id="'.esc_attr($file_id).'" data-title="'.esc_attr($title).'">Delete</button>';
            echo '</td></tr>';
          } ?>
          </tbody>
        </table>
      <?php else: ?>
        <p>No training documents found.</p>
      <?php endif; ?>
    </div>
    <?php
  } elseif ($current_tab==='import-pages') {
    $pages = get_pages(['post_status'=>'publish']);
    echo '<div class="card"><h2>Import WordPress Pages</h2>';
    if ($pages) {
      echo '<form method="post">';
      echo '<div style="max-height:500px;overflow:auto;border:1px solid #ddd;padding:10px;margin:10px 0">';
      echo '<table class="wp-list-table widefat fixed striped"><thead><tr><th></th><th>Page Title</th><th>Last Modified</th></tr></thead><tbody>';
      foreach ($pages as $p) {
        echo '<tr>';
        echo '<td><input type="checkbox" name="selected_pages[]" value="'.esc_attr($p->ID).'"></td>';
        echo '<td>'.esc_html($p->post_title).'</td>';
        echo '<td>'.esc_html(get_the_modified_date('Y-m-d H:i',$p->ID)).'</td>';
        echo '</tr>';
      }
      echo '</tbody></table></div>';
      wp_nonce_field('sensay_import_pages','sensay_import_nonce');
      submit_button('Import Selected Pages','primary','import_pages_submit',false);
      echo '</form>';
    } else {
      echo '<p>No published pages found.</p>';
    }
    echo '</div>';

    if (isset($_POST['import_pages_submit']) && !empty($_POST['selected_pages'])) {
      check_admin_referer('sensay_import_pages','sensay_import_nonce');
      $imported=0; $errors=[];
      foreach ((array)$_POST['selected_pages'] as $pid) {
        $page = get_post($pid);
        if ($page && $page->post_status==='publish') {
          $title = $page->post_title;
          $content = "# " . $title . "\n\n" . wp_strip_all_tags(apply_filters('the_content',$page->post_content));
          $upload_dir = wp_upload_dir();
          $fname = 'Page_' . sanitize_title($title) . '.txt';
          $tmp = $upload_dir['path'].'/'.$fname;
          if (file_put_contents($tmp, $content)!==false) {
            $signed = sensay_get_signed_url($fname);
            if (!empty($signed['success'])) {
              $up = sensay_upload_file($signed['signedUrl'], $tmp, 'text/plain');
              if (!empty($up['success'])) $imported++;
              else $errors[] = 'Upload failed: '.$title.' - '.($up['error']??'Unknown');
            } else {
              $errors[] = 'Signed URL error: '.$title.' - '.($signed['error']??'Unknown');
            }
            @unlink($tmp);
          } else {
            $errors[] = 'Temp file create failed: '.$title;
          }
        }
      }
      if ($imported>0) echo '<div class="notice notice-success is-dismissible"><p>Imported '.$imported.' page(s).</p></div>';
      if ($errors) {
        echo '<div class="notice notice-error"><p>Some errors occurred:</p><ul>';
        foreach ($errors as $e) echo '<li>'.esc_html($e).'</li>';
        echo '</ul></div>';
      }
    }

  } else { // import-menus
    $menus = wp_get_nav_menus();
    echo '<div class="card"><h2>Import WordPress Menus</h2>';
    if ($menus) {
      echo '<form method="post"><div style="max-height:500px;overflow:auto;border:1px solid #ddd;padding:10px;margin:10px 0">';
      echo '<table class="wp-list-table widefat fixed striped"><thead><tr><th></th><th>Menu Name</th><th>Items</th></tr></thead><tbody>';
      foreach ($menus as $menu) {
        $items = wp_get_nav_menu_items($menu->term_id,['post_status'=>'publish']);
        $cnt = is_array($items)?count($items):0;
        echo '<tr>';
        echo '<td><input type="checkbox" name="selected_menus[]" value="'.esc_attr($menu->term_id).'"></td>';
        echo '<td>'.esc_html($menu->name).'</td>';
        echo '<td>'.esc_html($cnt).' items</td>';
        echo '</tr>';
      }
      echo '</tbody></table></div>';
      wp_nonce_field('sensay_import_menus','sensay_import_menu_nonce');
      submit_button('Import Selected Menus','primary','import_menus_submit',false);
      echo '</form>';
    } else {
      echo '<p>No menus found.</p>';
    }
    echo '</div>';

    if (isset($_POST['import_menus_submit']) && !empty($_POST['selected_menus'])) {
      check_admin_referer('sensay_import_menus','sensay_import_menu_nonce');
      $imported=0; $errors=[];
      foreach ((array)$_POST['selected_menus'] as $menu_id) {
        $menu = wp_get_nav_menu_object($menu_id);
        if ($menu) {
          $items = wp_get_nav_menu_items($menu->term_id,['post_status'=>'publish']);
          $lines = ["### MENU","name: ".$menu->name,"locale: ".get_locale(),"updated_at: ".date('Y-m-d H:i'),"", "[Tree]"];
          $by_parent = [];
          foreach ($items as $it) { $by_parent[$it->menu_item_parent][] = $it; }
          $walk = function($parent=0,$lvl=0) use (&$walk,$by_parent,&$lines) {
            if (empty($by_parent[$parent])) return;
            foreach ($by_parent[$parent] as $it) {
              $indent = str_repeat('  ',$lvl);
              $title = $it->title ?: '(untitled)';
              $url   = $it->url ?: '';
              $lines[] = $indent . '- ' . $title . ($url ? ' -> ' . $url : '');
              if (!empty($by_parent[$it->ID])) $walk($it->ID, $lvl+1);
            }
          };
          $walk(0);
          $content = implode("\n",$lines);

          $upload_dir = wp_upload_dir();
          $fname = 'Menu_' . sanitize_title($menu->name) . '.txt';
          $tmp = $upload_dir['path'].'/'.$fname;
          if (file_put_contents($tmp, $content)!==false) {
            $signed = sensay_get_signed_url($fname);
            if (!empty($signed['success'])) {
              $up = sensay_upload_file($signed['signedUrl'], $tmp, 'text/plain');
              if (!empty($up['success'])) $imported++;
              else $errors[] = 'Upload failed: '.$menu->name.' - '.($up['error']??'Unknown');
            } else {
              $errors[] = 'Signed URL error: '.$menu->name.' - '.($signed['error']??'Unknown');
            }
            @unlink($tmp);
          } else {
            $errors[] = 'Temp file create failed: '.$menu->name;
          }
        }
      }
      if ($imported>0) echo '<div class="notice notice-success is-dismissible"><p>Imported '.$imported.' menu(s).</p></div>';
      if ($errors) {
        echo '<div class="notice notice-error"><p>Some errors occurred:</p><ul>';
        foreach ($errors as $e) echo '<li>'.esc_html($e).'</li>';
        echo '</ul></div>';
      }
    }
  }

  ?>
  <div id="document-details-modal" class="sensay-modal" style="display:none;">
    <div class="sensay-modal-content">
      <div class="sensay-modal-header">
        <h2>Document Details</h2>
        <span class="sensay-modal-close">&times;</span>
      </div>
      <div class="sensay-modal-body">
        <div class="document-detail"><strong>Filename:</strong> <span id="doc-filename"></span></div>
        <div class="document-detail"><strong>Type:</strong> <span id="doc-type"></span></div>
        <div class="document-detail"><strong>Status:</strong> <span id="doc-status"></span></div>
        <div class="document-detail"><strong>Created At:</strong> <span id="doc-created"></span></div>
        <div class="document-detail full-width">
          <strong>Content:</strong>
          <div id="doc-content" class="document-content"></div>
        </div>
      </div>
    </div>
  </div>

  <style>
    .card{background:#fff;border:1px solid #ccd0d4;box-shadow:0 1px 1px rgba(0,0,0,.04);padding:20px;margin-bottom:20px}
    .sensay-upload-area{border:2px dashed #c3c4c7;border-radius:4px;padding:40px 20px;text-align:center;background:#f9f9f9;margin-bottom:20px;transition:.3s}
    .sensay-upload-area.highlight{border-color:#2271b1;background:#f0f6fc}
    .browse-link{color:#2271b1;text-decoration:underline;cursor:pointer}
    .file-input{position:absolute;width:0.1px;height:0.1px;opacity:0;overflow:hidden;z-index:-1}
    .status-badge{display:inline-block;padding:2px 8px;border-radius:12px;font-size:12px;background:#eef}
    .sensay-modal{position:fixed;z-index:100000;left:0;top:0;width:100%;height:100%;background:rgba(0,0,0,.7)}
    .sensay-modal-content{background:#fff;margin:5% auto;padding:20px;border:1px solid #888;width:80%;max-width:800px;max-height:80vh;overflow-y:auto;position:relative}
    .sensay-modal-header{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #ddd;margin-bottom:15px}
    .sensay-modal-close{cursor:pointer;font-size:24px}
    .document-content{margin-top:10px;padding:15px;background:#fff;border:1px solid #ddd;border-radius:4px;max-height:400px;overflow:auto}
  </style>
  <script>
  jQuery(function($){
    const dropArea = $('#drag-drop-area'), fileInput = $('#training_file'),
          fileInfo = $('#file-info'), fileName = $('#file-name'), fileSize = $('#file-size'),
          removeBtn = $('#remove-file'), browse = $('.browse-link'), uploadBtn = $('#upload-button');

    function prevent(e){ e.preventDefault(); e.stopPropagation(); }
    ['dragenter','dragover','dragleave','drop'].forEach(ev=>{
      document.body.addEventListener(ev, prevent, false);
      dropArea[0] && dropArea[0].addEventListener(ev, prevent, false);
    });
    ['dragenter','dragover'].forEach(ev=>{
      dropArea[0] && dropArea[0].addEventListener(ev, ()=>dropArea.addClass('highlight'), false);
    });
    ['dragleave','drop'].forEach(ev=>{
      dropArea[0] && dropArea[0].addEventListener(ev, ()=>dropArea.removeClass('highlight'), false);
    });
    dropArea.on('drop', (e)=>{
      const files = e.originalEvent.dataTransfer.files;
      fileInput[0].files = files;
      handleFiles(files);
    });
    browse.on('click', ()=> fileInput.trigger('click'));
    fileInput.on('change', (e)=> handleFiles(e.target.files));
    removeBtn.on('click', ()=> { fileInput.val(''); fileInfo.hide(); uploadBtn.prop('disabled', true); });

    function handleFiles(files){
      if(!files || !files.length) return;
      const f = files[0];
      fileName.text(f.name);
      fileSize.text((f.size/1024/1024).toFixed(2)+' MB');
      fileInfo.show();
      uploadBtn.prop('disabled', false);
    }

    const modal = $('#document-details-modal'); const closeBtn = $('.sensay-modal-close');
    $(document).on('click','.view-document', function(){
      const id = $(this).data('doc-id');
      $('#doc-filename,#doc-type,#doc-status,#doc-created').text('Loading...');
      $('#doc-content').text('Loading...');
      modal.show();
      $.get(ajaxurl, {action:'sensay_get_document_details', document_id:id}, function(resp){
        if(resp.success){
          const d = resp.data;
          $('#doc-filename').text(d.filename);
          $('#doc-type').text(d.type);
          $('#doc-status').text(d.status);
          $('#doc-created').text(d.created_at);
          let c = d.raw_text || '';
          c = c
            .replace(/^##\s+(.*$)/gm,'<h3>$1</h3>')
            .replace(/^###\s+(.*$)/gm,'<h4>$1</h4>')
            .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
            .replace(/\*(.*?)\*/g,'<em>$1</em>')
            .replace(/\n\n/g,'</p><p>')
            .replace(/\n/g,'<br>')
            .replace(/^\s*[-*]\s+(.*$)/gm,'<li>$1</li>')
            .replace(/(<li>.*<\/li>)/gs,'<ul>$1</ul>')
            .replace(/<\/ul>\s*<ul>/g,'');
          if (!c.startsWith('<h') && !c.startsWith('<p>') && !c.startsWith('<ul>')) c = '<p>'+c+'</p>';
          $('#doc-content').html(c);
        } else {
          $('#doc-content').text('Error: '+(resp.data || 'Failed to load'));
        }
      });
    });
    closeBtn.on('click', ()=> modal.hide());
    $(window).on('click', (e)=> { if ($(e.target).is(modal)) modal.hide(); });

    $(document).on('click','.delete-document', function(e){
      e.preventDefault();
      const $btn = $(this), id = $btn.data('doc-id'), title = $btn.data('title')||'this document', $row = $btn.closest('tr');
      if (!id) return alert('Invalid document id.');
      if (!confirm('Delete "'+title+'"? This cannot be undone.')) return;
      $btn.prop('disabled', true).text('Deleting...');
      $.post(ajaxurl, {action:'sensay_delete_document', document_id:id, _ajax_nonce:'<?php echo wp_create_nonce("sensay_training_nonce"); ?>'}, function(resp){
        if (resp && resp.success) {
          $row.fadeOut(200, ()=>{$row.remove();});
        } else {
          alert(resp.error || 'Delete failed.');
          $btn.prop('disabled', false).text('Delete');
        }
      });
    });
  });
  </script>
  <?php
  echo '</div>';
}

/** ─────────────────────────────────────────────────────────
 *  14) FRONTEND CHAT WIDGET (footer)
 *  ───────────────────────────────────────────────────────── */
add_action('wp_footer', function () {
  if (is_admin()) return;

  $bootstrap = [
    'replicaId'    => get_option('sensay_replica_id'),
    'restChat'     => rest_url('sensay/v1/chat'),
    'restHist'     => rest_url('sensay/v1/history'),
    'restBoot'     => rest_url('sensay/v1/bootstrap'),
  ];
  ?>
  <style>
    #ss-chat { --user-bg:#007bff; --user-text:#fff; --bot-bg:#f1f3f4; --bot-text:#202124; --header-bg:#1a73e8; --r:12px; --shadow:0 1px 2px rgba(60,64,67,.3),0 1px 3px 1px rgba(60,64,67,.15); }
    #ss-chat * { box-sizing:border-box; font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,'Open Sans','Helvetica Neue',sans-serif; }
    #ss-open{position:fixed;right:24px;bottom:24px;width:56px;height:56px;border-radius:50%;background:var(--header-bg);color:#fff;border:none;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.2);font-size:24px;display:flex;align-items:center;justify-content:center;transition:.2s;z-index:1000000}
    #ss-open:hover{transform:scale(1.05);box-shadow:0 4px 12px rgba(0,0,0,.25)}
    #ss-box{position:fixed;right:24px;bottom:96px;width:380px;max-width:calc(100vw - 48px);height:600px;max-height:calc(100vh - 120px);background:#fff;border-radius:var(--r);box-shadow:var(--shadow);display:none;flex-direction:column;overflow:hidden;z-index:1000000}
    #ss-header{background:var(--header-bg);color:#fff;padding:16px;font-weight:600;font-size:15px;display:flex;align-items:center;justify-content:space-between}
    #ss-close{background:none;border:none;color:#fff;font-size:20px;cursor:pointer;padding:4px;opacity:.85}
    #ss-close:hover{opacity:1}
    #ss-log{flex:1;padding:16px;overflow-y:auto;background:#f8f9fa;display:flex;flex-direction:column;gap:16px}
    .message{max-width:80%;padding:12px 16px;border-radius:18px;line-height:1.45;word-wrap:break-word;font-size:14px;box-shadow:0 1px 2px rgba(0,0,0,.06)}
    .message.user{background:var(--user-bg);color:var(--user-text);margin-left:auto;border-bottom-right-radius:4px}
    .message.bot{background:var(--bot-bg);color:var(--bot-text);margin-right:auto;border-bottom-left-radius:4px}
    .message.info{margin:8px auto;background:#e9ecef;color:#495057;font-size:12px;padding:8px 12px;border-radius:12px;text-align:center;max-width:90%}
    #ss-input-wrap{padding:12px 16px;background:#fff;border-top:1px solid #e9ecef}
    #ss-input{width:100%;padding:12px 16px;border:1px solid #dee2e6;border-radius:24px;font-size:14px;outline:none}
    #ss-input:focus{border-color:var(--header-bg);box-shadow:0 0 0 3px rgba(26,115,232,.2)}
    #ss-log::-webkit-scrollbar{width:6px} #ss-log::-webkit-scrollbar-thumb{background:#c1c1c1;border-radius:3px}
    @media (max-width:480px){#ss-box{right:0;bottom:0;width:100%;height:100%;border-radius:0}}
  </style>

  <div id="ss-chat">
    <button id="ss-open" aria-label="Open chat">💬</button>
    <div id="ss-box">
      <div id="ss-header">
        <span>Customer Assistant</span>
        <button id="ss-close" aria-label="Close chat">×</button>
      </div>
      <div id="ss-log"></div>
      <div id="ss-input-wrap"><input id="ss-input" type="text" placeholder="Type your message..." autocomplete="off"></div>
    </div>
  </div>

  <script>
  (function(){
    const CFG = <?php echo wp_json_encode($bootstrap); ?>;
    const btn = document.getElementById('ss-open');
    const box = document.getElementById('ss-box');
    const log = document.getElementById('ss-log');
    const inp = document.getElementById('ss-input');
    const closeBtn = document.getElementById('ss-close');
    let historyLoaded=false, loading=false, ctx={replicaId:null,sensayUserId:null};

    const md = (t)=> t ? t
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
      .replace(/\*(.*?)\*/g,'<em>$1</em>')
      .replace(/`([^`]+)`/g,'<code style="background:rgba(0,0,0,.05);padding:2px 4px;border-radius:3px;font-family:monospace">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g,(m,txt,url)=>`<a href="${url.startsWith('http')?url:`https://${url}`}" target="_blank" rel="noopener" style="color:#1a73e8;text-decoration:none;border-bottom:1px solid #8ab4f8">${txt}</a>`)
      .replace(/\n\s*\n/g,'</p><p>').replace(/\n/g,'<br>') : '';

    function append(role, text){
      if(!text) return;
      const el = document.createElement('div');
      if(role==='assistant'||role==='bot'){ el.className='message bot'; }
      else if(role==='user'){ el.className='message user'; }
      else { el.className='message info'; }
      el.innerHTML = md(text);
      log.appendChild(el); log.scrollTop = log.scrollHeight;
    }

    async function bootstrap(){
      try{
        const r = await fetch(CFG.restBoot);
        const j = await r.json();
        ctx.replicaId = j.replicaId;
        ctx.sensayUserId = j.sensayUserId; // internal
      }catch(e){ append('info','Bootstrap failed.'); }
    }

    async function loadHistory(limit){
      if(!ctx.replicaId || !ctx.sensayUserId) return;
      try{
        const u = new URL(CFG.restHist, location.origin);
        u.searchParams.set('replica_id', ctx.replicaId);
        u.searchParams.set('user_id', ctx.sensayUserId);
        u.searchParams.set('limit', String(limit||30));
        const r = await fetch(u.toString());
        const j = await r.json();
        const items = Array.isArray(j.items) ? j.items : [];
        items.forEach(m => append(m.role || 'user', m.content || ''));
        if (!items.length) append('info','(No history)');
      }catch(err){ append('info','Error loading history'); }
    }

    async function sendMessage(msg){
      loading=true;
      const typing=document.createElement('div');
      typing.className='message info'; typing.textContent='typing...';
      log.appendChild(typing); log.scrollTop=log.scrollHeight;

      try{
        const r = await fetch(CFG.restChat,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({content:msg})});
        const j = await r.json();
        typing.remove();
        append('bot', j && j.reply ? j.reply : (j.error||'Error'));
      }catch(e){
        typing.remove();
        append('bot','Network error.');
      } finally { loading=false; }
    }

    function toggleChat(show){
      const open = show ?? (box.style.display!=='flex');
      if(open){
        box.style.display='flex';
        if(!ctx.replicaId) bootstrap().then(()=>{ if(!historyLoaded){ append('info','Loading history...'); loadHistory(30).then(()=>{ historyLoaded=true; const last=log.lastChild; if(last && last.classList.contains('info') && last.textContent==='Loading history...') last.remove(); }); } });
        inp.focus();
      } else {
        box.style.display='none';
      }
    }

    btn.addEventListener('click', (e)=>{ e.preventDefault(); toggleChat(); });
    closeBtn.addEventListener('click', (e)=>{ e.preventDefault(); toggleChat(false); });
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape' && box.style.display==='flex') toggleChat(false); });
    inp.addEventListener('keydown',(e)=>{ if(e.key==='Enter' && !loading){ const v=inp.value.trim(); if(!v) return; inp.value=''; append('user',v); sendMessage(v);} });
  })();
  </script>
  <?php
});
