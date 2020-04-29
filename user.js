const users = []

const addUser = ({ id, name, group}) => {

    name = name.trim().toUpperCase()
    group = group.trim().toUpperCase()

    const availableUser = users.find((user) => user.group === group && user.name === name)
    if(availableUser){
        return { error : 'Username is already taken.'}
    }
    if(!name || !group){
        return { error : 'Username and group name is required.'}
    }

    const user = { id, name, group}
    users.push(user)
    return { user }
}

const deleteUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => users.find((user) => user.id === id)

const getGroupUser = (group) => users.filter((user) => user.group === group)

module.exports = { addUser, deleteUser, getUser, getGroupUser }