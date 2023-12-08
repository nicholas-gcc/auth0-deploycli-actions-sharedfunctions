exports.onExecutePostLogin = async (event, api) => {
    const userName = event.user.email || 'someone@example.com';
    console.log(greet(userName)); // Reusing the same shared function
};
