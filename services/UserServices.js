exports.updateUser = (req, params) => {
    return req.user.update(params);
};