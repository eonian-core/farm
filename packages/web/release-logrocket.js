function releaseLogRocket() {
    const commit = process.env.VERCEL_GIT_COMMIT_SHA;
    const key = process.env.LOGROCKET_API_KEY;
    const env = process.env.VERCEL_ENV;
    const ref = process.env.VERCEL_GIT_COMMIT_REF;
    const commitMessage = process.env.VERCEL_GIT_COMMIT_MESSAGE;

    console.log('Performing LogRocket release...');
    console.log(`Commit ${commit}, message: ${commitMessage}`);
    console.log(`Key ${key}`);
    console.log(`Env ${env}`);
    console.log(`Ref ${ref}`);
}

releaseLogRocket();
