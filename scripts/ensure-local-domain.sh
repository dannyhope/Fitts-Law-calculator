#!/bin/sh
set -eu

root="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
domain="$(tr -d '[:space:]' < "$root/.local-domain")"

case "$domain" in
  ''|*[!a-zA-Z0-9.-]*) echo "Invalid local domain: $domain" >&2; exit 1 ;;
esac

marker="# fitts-law-calculator.local"
entry="127.0.0.1 $domain $marker"

if grep -Fq "$marker" /etc/hosts 2>/dev/null && grep -Fq "127.0.0.1 $domain" /etc/hosts 2>/dev/null; then
  echo "$domain resolves via /etc/hosts"
  exit 0
fi

echo "Adding $domain to /etc/hosts (administrator permission required)"
sudo sh -c "printf '%s\n' '$entry' >> /etc/hosts"
echo "$domain resolves via /etc/hosts"
