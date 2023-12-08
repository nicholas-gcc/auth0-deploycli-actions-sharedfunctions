exports.onExecutePostLogin = async (event, api) => {
    const userName = event.user.name || 'User';
    console.log(greet(userName)); // Using the shared function
};
