#!/bin/bash

# Verify all prerequisites are installed

echo "=== Verifying Prerequisites ==="

# Check Node.js
if command -v node &> /dev/null; then
    echo "✓ Node.js: $(node --version)"
else
    echo "✗ Node.js not found"
fi

# Check Docker
if command -v docker &> /dev/null; then
    echo "✓ Docker: $(docker --version)"
else
    echo "✗ Docker not found"
fi

# Check kubectl
if command -v kubectl &> /dev/null; then
    echo "✓ kubectl: $(kubectl version --client --short 2>/dev/null)"
else
    echo "✗ kubectl not found"
fi

# Check AWS CLI
if command -v aws &> /dev/null; then
    echo "✓ AWS CLI: $(aws --version)"
else
    echo "✗ AWS CLI not found"
fi

# Check Pulumi
if command -v pulumi &> /dev/null; then
    echo "✓ Pulumi: $(pulumi version)"
else
    echo "✗ Pulumi not found"
fi

echo ""
echo "=== Checking AWS Configuration ==="
aws sts get-caller-identity &> /dev/null
if [ $? -eq 0 ]; then
    echo "✓ AWS credentials configured"
    echo "  Account: $(aws sts get-caller-identity --query Account --output text)"
    echo "  Region: $(aws configure get region)"
else
    echo "✗ AWS credentials not configured"
fi

echo ""
echo "=== Setup Verification Complete ==="
