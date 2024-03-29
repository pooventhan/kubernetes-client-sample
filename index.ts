import * as k8s from '@kubernetes/client-node';

main()
.then(() => {
    console.log('execution complete.');
})
.catch(err => { 
    console.error(err);
    process.exitCode = 1;
});

async function main(): Promise<void>{

    const kc = new k8s.KubeConfig();
    //kc.loadFromDefault();
    console.log("Loading config from file...");
    kc.loadFromFile('/root/.kube/config');

    console.log("Setting current context to dev-dell...");
    kc.setCurrentContext('dev-dell');
    // const contexts = kc.getContexts();
    // contexts.forEach(context => {
    //     console.log(`Context name: ${context.name}`);
    // });

    const k8sApi = kc.makeApiClient(k8s.AppsV1Api);

    console.log("Getting the list of deployments...");
    //const deploymentResponse = await k8sApi.listNamespacedDeployment('dev-dell');
    const deploymentResponse = await k8sApi.listDeploymentForAllNamespaces()
    const deploymentList = deploymentResponse.body.items;
    console.log(`Found ${deploymentList.length} deployments.`);

    deploymentList.forEach(deployment => {
        console.log(`Deployment: ${deployment.metadata?.namespace}, Cluster: ${deployment.metadata?.clusterName}`);
        //console.log(`${deployment.metadata?.name} : ${getImageVersion(deployment.spec?.template?.spec?.containers?.[0]?.image)}`);
    });
}

function getImageVersion(image: string | undefined): string {

    if(image) {
        const parts = image.split(':');
        return parts[1];
    }

    return '';
}