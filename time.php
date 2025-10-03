<?php
function getNtpTime($host = 'pool.ntp.org') {
  $socket = socket_create(AF_INET, SOCK_DGRAM, SOL_UDP);

  // NTP request header
  $msg = "\010" . str_repeat("\0", 47);
  $server = gethostbyname($host);

  socket_sendto($socket, $msg, strlen($msg), 0, $server, 123);
  socket_recvfrom($socket, $recv, 48, 0, $server, $port);

  // Unpack binary to unsigned long
  $data = unpack('N12', $recv);
  $timestamp = sprintf('%u', $data[9]);

  // NTP timestamps are from 1900, Unix from 1970
  $timestamp -= 2208988800;

  // return gmdate('Y-m-d H:i:s', $timestamp);
  return gmdate('c', $timestamp);
}

header('Content-Type: application/json');
echo json_encode(['serverTime' => getNtpTime()]);
?>
