# Step1
Note: Make sure you have installed Docker Desktop.
1. Install Minikube

    # For Windows:
    # Option 1:
    Install Virtualization Software:

    Hyper-V is typically used with Windows. If it's not enabled, follow these steps:

    Open PowerShell as an Administrator and run the following command:

        dism.exe /Online /Enable-Feature:Microsoft-Hyper-V-All /All /LimitAccess /Restart

        Restart your computer.
    
    Alternatively, you can use VirtualBox if Hyper-V is not an option.

    # Option 2:

    Install Minikube using Chocolatey:

    If you don't have Chocolatey, install it first by running this PowerShell command (as Administrator):

        Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 0x00000C00; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))

    Then, install Minikube via Chocolatey:

        choco install minikube

    Start Minikube:

    To start Minikube with the default configuration:

        minikube start --driver=hyperv

    Install kubectl (if not already installed):

        choco install kubernetes-cli

    # For MacOS:

    Run the below commands in terminal:

        curl -LO https://github.com/kubernetes/minikube/releases/latest/download/minikube-darwin-arm64

        sudo install minikube-darwin-arm64 /usr/local/bin/minikube
    
        minikube start

# Step 2:

2. Create NGINX Pod Using Both Imperative and Declarative Ways

    Imperative Way (Windows and MacOS):

        kubectl run nginx --image=nginx --restart=Never

    Declarative Way (Windows and MacOS):

    Create a YAML file named nginx-pod.yaml:

        apiVersion: v1
        kind: Pod
        metadata:
        name: nginx
        spec:
        containers:
        - name: nginx
            image: nginx

    Apply the manifest:

        kubectl apply -f nginx-pod.yaml

# Step 3:

3. Create a NodePort Service to Expose the NGINX Pod to the Node Port

    Create a NodePort Service (Windows and MacOS):

    Create the YAML file named nginx-service.yaml:

        apiVersion: v1
        kind: Service
        metadata:
        name: nginx-service
        spec:
        selector:
            app: nginx
        ports:
            - protocol: TCP
            port: 80
            targetPort: 80
            nodePort: 30001
        type: NodePort

    Apply the Service:

        kubectl apply -f nginx-service.yaml

# Step 4:
4. Expose the Service Through Minikube and Access It via Browser

    Expose the Service (Windows and MacOS):
    
    Run Minikube tunnel to expose the service:

        minikube tunnel

    Access the service by visiting the URL in your browser:

        Go to http://<minikube-ip>:30001

    You can get the Minikube IP by running:

        minikube ip

# Step 5:
5. Create a ReplicaSet for NGINX Using Manifest

    Create the ReplicaSet Manifest (Windows and MacOS):

    Create the YAML file named nginx-replicaset.yaml:

        apiVersion: apps/v1
        kind: ReplicaSet
        metadata:
        name: nginx-replicaset
        spec:
        replicas: 3
        selector:
            matchLabels:
            app: nginx
        template:
            metadata:
            labels:
                app: nginx
            spec:
            containers:
            - name: nginx
                image: nginx

    Apply the ReplicaSet:

        kubectl apply -f nginx-replicaset.yaml

    Check ReplicaSet:

        kubectl get replicasets

# Step 6:
6. Deploy New Image Version of NGINX in Replicas and Scale the Replicas to 0, Then Back to Normal

    Step 1: Update NGINX Image:

    Update the ReplicaSet YAML to use a new version of NGINX, e.g., nginx:1.21:
containers:

        - name: nginx
          image: nginx:1.21

    Apply the updated YAML:

        kubectl apply -f nginx-replicaset.yaml

    Verify the update:

        kubectl get pods

    Step 2: Scale Replicas to 0 and Back:

    Scale to 0:

        kubectl scale replicasets/nginx-replicaset --replicas=0

    Scale back to the original number (e.g., 3):

        kubectl scale replicasets/nginx-replicaset --replicas=3

# Step 7:
7. Create a Deployment Using Manifest for the NGINX ReplicaSet

    Create the Deployment Manifest (Windows and MacOS):

    Create a YAML file named nginx-deployment.yaml:

        apiVersion: apps/v1
        kind: Deployment
        metadata:
        name: nginx-deployment
        spec:
        replicas: 3
        selector:
            matchLabels:
            app: nginx
        template:
            metadata:
            labels:
                app: nginx
            spec:
            containers:
            - name: nginx
                image: nginx

    Apply the Deployment:

        kubectl apply -f nginx-deployment.yaml

    Check the Deployment:

        kubectl get deployments
