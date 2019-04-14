var allUsers = [];
var allGroups = [];
var allRights = [];
var authenticatedUser;

function itemInArray(array, item) {
	// if (array.indexOf(item) == -1) 
	// 	throw new Error();
	var a = false;
	for (var i=0; i<array.length; i++){
		if (array[i] == item) a = true;
	}
	if (a != true) throw new Error();
}
function remove(array, item) {
	return array.filter(function(elem) { return item != elem });
}

function createUser(nick, password) {
	allUsers.push({nickname:nick, password:password, groups:[]});
	return allUsers[allUsers.length - 1];
};

function deleteUser(user) {
	itemInArray(allUsers, user);
	for (var i=0; i<allUsers.length; i++){
		if (allUsers[i].nickname == user.nickname) {
			allUsers.splice(i,1);
		}
	}
};

function users() {return allUsers;};

function createGroup(group) {
	allGroups.push({group:group, rights:[]});
	return allGroups[allGroups.length-1];
};

function deleteGroup(group) {
	itemInArray(allGroups, group);

	allGroups.splice(allGroups.indexOf(group), 1);
	
	allUsers.forEach(function(user) {
		user.groups = remove(user.groups, group);
	});
};

function groups() {return allGroups;};

function addUserToGroup(user, group) {
	itemInArray(allGroups, group);
	itemInArray(allUsers, user);
	user.groups.push(group);
};

function userGroups(user) {
	return user.groups;
};

function removeUserFromGroup(user, group) {
	itemInArray(allUsers, user);
	itemInArray(allGroups, group);
	itemInArray(user.groups, group);

	user.groups.splice(user.groups.indexOf(group),1);
	

};

function createRight(right) {
	allRights.push({right});
	return allRights[allRights.length-1];
};

function deleteRight(right) {
	itemInArray(allRights, right);
	allRights.splice(allRights.indexOf(right),1);

	allGroups.forEach(function(group) {
		group.rights = remove(group.rights, right);
	});
};

function groupRights(group) {
	itemInArray(allGroups, group);
	return group.rights;
};

function rights() {return allRights;};

function addRightToGroup(right, group) {
	itemInArray(allRights, right);
	itemInArray(allGroups, group);
	group.rights.push(right);
};

function removeRightFromGroup(right, group) {
	itemInArray(allRights, right);
	itemInArray(allGroups, group);
	itemInArray(group.rights, right);
	group.rights.splice(group.rights.indexOf(right),1);

};

function login(username, password) {
	if (authenticatedUser)
		return false;

	var user = allUsers.find(function(user) { 
		return user.username === username && user.password === password;
	});

	if (user) {
		authenticatedUser = user;
		return true;
	}

	return false;
};

function currentUser() {return authenticatedUser;};

function logout() {authenticatedUser = undefined;};

function isAuthorized(user, right) {
	itemInArray(allUsers, user);
	itemInArray(allRights, right);
	return user.groups.reduce(function(result, group) {
		return result.concat(group.rights);
	}, []).indexOf(right) != -1;

};