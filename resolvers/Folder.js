module.exports = serviceContext => {
    const queryMap = {
        user: (root, args) => {
            console.log(root);
            return serviceContext.dal.getUserById(root.userId);
        },
    }
    return queryMap;
}