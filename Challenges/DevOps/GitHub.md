# Step 1: Install Git

    # On Windows

    Using GitHub Desktop:

    Download GitHub Desktop: Visit the GitHub Desktop website: https://desktop.github.com/ and download the installer.

    Install GitHub Desktop: Open the installer and follow the instructions to install GitHub Desktop.

    Set up GitHub Desktop: Once installed, open GitHub Desktop and sign in with your GitHub account.

    Using Git CLI:

        Download Git for Windows: https://git-scm.com/download/win

    Install Git: 
    
        Run the installer and follow the installation instructions. Choose default options (for Git Bash and Git GUI).

    # On Mac

    Using GitHub Desktop:

    Download GitHub Desktop: Go to https://desktop.github.com/ and download the macOS installer.

    Install GitHub Desktop: Open the installer and follow the instructions to install GitHub Desktop.

    Set up GitHub Desktop: Once installed, launch GitHub Desktop and sign in with your GitHub account.

    Using Git CLI:

        Install Git via Homebrew (If Homebrew is not installed, run xcode-select --install to install the Xcode Command Line Tools, which includes Git):

        brew install git

    Or, you can download the Git installer directly from Git Downloads for macOS.

# Step 2: Create a Public GitHub Repository

    Go to GitHub: Open https://github.com/ and log into your account.

    Create a New Repository:

        Click the + icon in the upper-right corner of the page and select New repository.

        Name your repository (e.g., feature-branch-example), select Public for visibility, and click Create repository.

# Step 3: Clone the Repository

    Using GitHub Desktop

    Open GitHub Desktop: If it's not already open, launch GitHub Desktop.

    Clone the Repository:

        Click on File > Clone Repository.

        Choose your newly created repository under GitHub.com.

        Select a local path to clone the repository and click Clone.
    
    Using Git CLI:

        Open the terminal (Git Bash on Windows or Terminal on macOS).

        Clone the repository by running:

        git clone https://github.com/your-username/feature-branch-example.git

# Step 4: Create a Feature Branch

    Using GitHub Desktop

    Create a New Branch:

        In GitHub Desktop, go to the repository and click on Current Branch in the top left corner.

        Click New Branch.

        Enter a name for your new branch (e.g., feature-branch) and click Create Branch.

    Using Git CLI

    In the terminal, navigate to the cloned repository's directory:

        cd feature-branch-example

    Create a new branch by running:

        git checkout -b feature-branch

# Step 5: Upload or Create a File in the Feature Branch

    Using GitHub Desktop

    Add a File:

        Create or add a file to the repository folder in your file explorer (e.g., new-file.txt).

    Commit Changes:

        Go back to GitHub Desktop. You should see the changes listed in the Changes tab.

        Add a commit message (e.g., Add new-file.txt).

        Click Commit to feature-branch.

    Using Git CLI

    Add a new file to the repository, for example:

        echo "Hello, World!" > new-file.txt

    Add the file to Git:
        
        git add new-file.txt

    Commit the changes:
        
        git commit -m "Add new-file.txt"

# Step 6: Push the Feature Branch to GitHub

    Using GitHub Desktop

    Push Changes:
        
        In GitHub Desktop, click Push origin to push your changes to GitHub.

    Using Git CLI

    Push the branch to GitHub:
        
        git push -u origin feature-branch

# Step 7: Create a Pull Request

    Go to GitHub: Open your repository on GitHub.

    Create Pull Request:
        
        Click Compare & pull request.

    Ensure that base is main and compare is feature-branch.
    
    Add a title and description for the pull request and click Create pull request.

# Step 8: Merge the Pull Request

    Merge the Pull Request:
        
        On GitHub, after reviewing the pull request, click Merge pull request.

        Click Confirm merge to merge the changes into the main branch.

# Step 9: Pull the Changes to Your Local Repository

    Using GitHub Desktop

    Switch to the main Branch:
    
        In GitHub Desktop, click Current Branch and select main.

    Pull Changes:
        
        Click Repository > Pull to pull the latest changes from GitHub to your local machine.

    Using Git CLI

        Switch to the main branch:
        
        git checkout main
    
    Pull the changes:
        
        git pull origin main
