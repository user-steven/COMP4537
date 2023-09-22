#!/bin/bash


# commands

show_usage() {
    cat <<EOF
Usage: mygit-<command> [options] without any quotations

Commands:
  init <directory>                Initialize a Git repository in the specified directory
  clone <remote_url> <local_dir>  Clone a Git repository from a remote URL to a local directory
  commit <flag> <message>         Commit changes with the provided flag and message
  push                            Push changes to the remote repository
  create-directory <dir_name>     Create a new directory
  delete-file <file_name>         Delete a file
  delete-directory <dir_name>     Delete a directory and its contents
  list-contents <dir_name>        List contents of a directory
  quit                            Exit mygit
EOF
}

# Function to initialise a git repo

mygit_init() {
    local dir="$1"
    
    echo "Initialising git in: ${dir}"
    
    git init "$dir"
}

mygit_clone() {
    local remoteDir="$1"
    local localDir="$2"
    
    echo "Cloning ${remoteDir} to ${localDir}"
    
    git clone "$remoteDir" "$localDir"
}


mygit_commit() {
    local flag="$1"
    local msg="$2"
    
    git add . 
    
    echo "Commiting with msg: '${msg}'"
    
    git commit "$flag" "$msg"
}

mygit_push() {
    echo "Pushing to git"
    git push
}


mygit_create_directory() {
    local dirName="$1"
    mkdir "$dirName"
}

mygit_delete_file() {
    local fileName="$1"
    rm "$fileName"
}

mygit_delete_directory() {
    local dirName="$1"
    rm -r "$dirName"
}

mygit_list_contents() {
    local dirName="$1"
    ls "$dirName"
}

show_usage


while true; do

# ask user to enter a command
echo -n $'Enter a command (or 'mygit-quit' to exit): '

# store user input as an array
read -a usrCmd

    case "${usrCmd[0]}" in
        "mygit-init")
            echo "Running mygit-init..."
            mygit_init "${usrCmd[1]}"
            ;;
            
        "mygit-clone")
            echo "Running mygit-clone..."
            mygit_clone "${usrCmd[1]}" "${usrCmd[2]}"
            ;;
            
        "mygit-commit")
            echo "Running mygit-commit..."
            mygit_commit "${usrCmd[1]}" "${usrCmd[2]}"
            ;;
        
        "mygit-push")
            echo "Running mygit-push..."
            mygit_push
            ;;
            
        "mygit-create-directory")
            echo "Running mygit-create-directory..."
            mygit_create_directory "${usrCmd[1]}"
            ;;
            
        "mygit-delete-file")
            echo "Running mygit-delete-file..."
            mygit_delete_file "${usrCmd[1]}"
            ;;
        
        "mygit-delete-directory")
            echo "Running mygit-delete-directory..."
            mygit_delete_directory "${usrCmd[1]}"
            ;;
        
        "mygit-list-contents")
            echo "Running mygit-list-contents..."
            mygit_list_contents "${usrCmd[1]}"
            ;;
            
        "mygit-quit")
            echo "mygit is exiting ..."
            break
            ;;
    
        *)
            echo "Invalid Selection."
            ;;

    esac
    
done