#!/usr/bin/env bash
# AgentPulse Universal Unix Installer (macOS & Linux)
# Usage: curl -fsSL https://raw.githubusercontent.com/<OWNER>/<REPO>/main/install.sh | bash

set -e

REPO="${AGENTPULSE_REPO:-NomanRafique01/AgentPulse}"
INSTALL_DIR="$HOME/.agentpulse"
BIN_DIR="$INSTALL_DIR/bin"

echo "=========================================="
echo "  Installing AgentPulse (Signal System)   "
echo "=========================================="

OS="$(uname -s)"
ARCH="$(uname -m)"

case "$OS" in
  Darwin*)
    PLATFORM="darwin"
    ;;
  Linux*)
    PLATFORM="linux"
    ;;
  *)
    echo "Unsupported operating system: $OS" >&2
    exit 1
    ;;
esac

case "$ARCH" in
  x86_64)
    ARCH_TAG="x64"
    ;;
  arm64|aarch64)
    ARCH_TAG="arm64"
    ;;
  *)
    ARCH_TAG="x64"
    ;;
esac

ASSET="agentpulse-${PLATFORM}-${ARCH_TAG}.tar.gz"
URL="https://github.com/${REPO}/releases/latest/download/${ASSET}"
TMP_ARCHIVE="/tmp/${ASSET}"

echo "==> Downloading latest release package for ${PLATFORM}-${ARCH_TAG}..."

if curl -fL "$URL" -o "$TMP_ARCHIVE" 2>/dev/null; then
  echo "==> Downloaded from $URL"
else
  # Check local fallback
  if [ -f "./dist/$ASSET" ]; then
    echo "==> Using local distribution package: ./dist/$ASSET"
    cp "./dist/$ASSET" "$TMP_ARCHIVE"
  elif [ -f "./dist/agentpulse-windows-x64.zip" ]; then
    echo "==> Extracting universal bundle from ./dist/agentpulse-windows-x64.zip"
    mkdir -p "$INSTALL_DIR"
    unzip -q -o "./dist/agentpulse-windows-x64.zip" -d "$INSTALL_DIR"
    TMP_ARCHIVE=""
  else
    echo "Error: Could not download release archive from GitHub ($URL)." >&2
    exit 1
  fi
fi

if [ -n "$TMP_ARCHIVE" ] && [ -f "$TMP_ARCHIVE" ]; then
  mkdir -p "$INSTALL_DIR"
  tar -xzf "$TMP_ARCHIVE" -C "$INSTALL_DIR"
  rm -f "$TMP_ARCHIVE"
fi

chmod +x "$BIN_DIR/agentpulse" 2>/dev/null || true
chmod +x "$BIN_DIR/agentlight" 2>/dev/null || true

# Add to shell profile silently
SHELL_PROFILE=""
if [ -n "$ZSH_VERSION" ] || [ -f "$HOME/.zshrc" ]; then
  SHELL_PROFILE="$HOME/.zshrc"
elif [ -f "$HOME/.bashrc" ]; then
  SHELL_PROFILE="$HOME/.bashrc"
elif [ -f "$HOME/.profile" ]; then
  SHELL_PROFILE="$HOME/.profile"
fi

if [ -n "$SHELL_PROFILE" ]; then
  if ! grep -q "\.agentpulse/bin" "$SHELL_PROFILE" 2>/dev/null; then
    echo "" >> "$SHELL_PROFILE"
    echo "# AgentPulse CLI" >> "$SHELL_PROFILE"
    echo "export PATH=\"$BIN_DIR:\$PATH\"" >> "$SHELL_PROFILE"
    echo "==> Added $BIN_DIR to $SHELL_PROFILE"
  fi
fi

echo "============================================================"
echo "  AgentPulse installed successfully!                        "
echo "  Location: $INSTALL_DIR                                    "
echo "  Zero desktop clutter - pure background command system.    "
echo "  In any project folder, run:                               "
echo "    agentpulse init                                         "
echo "============================================================"

