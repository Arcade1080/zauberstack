#!/bin/bash

# Function to confirm before overwriting
confirm() {
    read -p "$1 (y/n) " -n 1 -r
    echo
    [[ $REPLY =~ ^[Yy]$ ]]
}

# Check if files exist
if [ -f ".env" ]; then
    if confirm "Backup existing .env file to .env.backup?"; then
        cp .env .env.backup
        echo "✅ Backed up .env to .env.backup"
    fi
fi

if [ -f ".env.example" ]; then
    if confirm "Backup existing .env.example file to .env.example.backup?"; then
        cp .env.example .env.example.backup
        echo "✅ Backed up .env.example to .env.example.backup"
    fi
fi

# Update .env.example
if confirm "Update .env.example with improved structure?"; then
    cp env-example-improved.txt .env.example
    echo "✅ Updated .env.example with improved structure"
fi

# Create or update .env
if [ -f ".env" ]; then
    if confirm "Would you like to merge your existing .env values with the new structure?"; then
        # Create a temporary file with the new structure
        cp env-secure-template.txt .env.new
        
        # Extract existing values and update the new file
        while IFS='=' read -r key value; do
            # Skip comments and empty lines
            [[ $key == \#* ]] || [[ -z $key ]] && continue
            
            # Find the key in the new file and replace its value
            if grep -q "^$key=" .env.new; then
                sed -i '' "s|^$key=.*|$key=$value|" .env.new
            fi
        done < .env
        
        # Replace the old file with the new one
        mv .env.new .env
        echo "✅ Merged existing values with new .env structure"
    else
        if confirm "Create a new .env file from template? (This will overwrite your current .env)"; then
            cp env-secure-template.txt .env
            echo "✅ Created new .env from template"
            echo "⚠️  Remember to update the values in .env with your actual credentials"
        fi
    fi
else
    if confirm "Create a new .env file from template?"; then
        cp env-secure-template.txt .env
        echo "✅ Created new .env from template"
        echo "⚠️  Remember to update the values in .env with your actual credentials"
    fi
fi

echo "Done! See ENV_DOCUMENTATION.md for more information."

# Make the script executable
chmod +x update-env-files.sh 