module.exports = function ({ models, api }) {
	const Users = models.use('Users');

	async function getInfo(id) {
		try {
			return (await api.getUserInfo(id))[id];
		}
		catch(e) {
			return false
		}
	}

	async function getNameUser(id) {
		try {
			if (global.data.userName.has(id)) return global.data.userName.get(id);
			else if (global.data.allUserID.includes(id)) {
				const nameUser = (await this.getData(id)).name;
				if (nameUser) return nameUser;
				else return "Người dùng facebook";
			} else return "Người dùng facebook";
		}
		catch { return "Người dùng facebook" }
	}

  async function getUserFull(id) {
		var resolveFunc = function () { };
	    var rejectFunc = function () { };
	    var returnPromise = new Promise(function (resolve, reject) {
	      resolveFunc = resolve;
	      rejectFunc = reject;
	    });
		try {
	        api.httpGet(`https://graph.facebook.com/${id}?fields=name,email,about,birthday,gender,hometown,link,location,quotes,relationship_status,significant_other,username,subscribers.limite(0),website&access_token=${global.account.accessToken}`, (e, i) => {
            	if (e) return rejectFunc(e)
	            var t = JSON.parse(i);
	            var dataUser = {
	                error: 0,
	                author: 'D-Jukie',
	                data: {
	                    name: t.name || null,
	                    username: t.username || null,
	                    uid: t.id || null,
	                    about: t.about || null,
	                    follow: t.subscribers.summary.total_count || 0,
	                    birthday: t.birthday || null,
	                    gender: t.gender,
	                    hometown: t.hometown || null,
	                    link: t.link || null,
	                    location: t.location || null,
	                    relationship_status: t.relationship_status || null,
	                    love: t.significant_other || null,
	                    quotes: t.quotes || null,
	                    website: t.website || null,
	                    imgavt: `https://graph.facebook.com/${t.id}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
	                }
	            };
	            return resolveFunc(dataUser)
	        });
	        return returnPromise
	    }
		catch(error) { 
		    return resolveFunc({
				error: 1, 
		        author: 'J-JRT',
		        data: {}
		    })
		}
	}

	async function getAll(...data) {
		var where, attributes;
		for (const i of data) {
			if (typeof i != 'object') throw global.getText("users", "needObjectOrArray");
			if (Array.isArray(i)) attributes = i;
			else where = i;
		}
		try {
			return (await Users.findAll({ where, attributes })).map(e => e.get({ plain: true }));
		}
		catch (error) {
			console.error(error);
			throw new Error(error);
		}
	}

	async function getData(userID) {
		try {
			const data = await Users.findOne({ where: { userID } });
			if (data) return data.get({ plain: true });
			else return false;
		}
		catch(error) {
			console.error(error);
			throw new Error(error);
		}
	}

	async function setData(userID, options = {}) {
		if (typeof options != 'object' && !Array.isArray(options)) throw global.getText("users", "needObject");
		try {
			(await Users.findOne({ where: { userID } })).update(options);
			return true;
		}
		catch (error) {
			try {
				await this.createData(userID, options);
			} catch (error) {
				console.error(error);
				throw new Error(error);
			}
		}
	}

	async function delData(userID) {
		try {
			(await Users.findOne({ where: { userID } })).destroy();
			return true;
		}
		catch (error) {
			console.error(error);
			throw new Error(error);
		}
	}

	async function createData(userID, defaults = {}) {
		if (typeof defaults != 'object' && !Array.isArray(defaults)) throw global.getText("users", "needObject");
		try {
			await Users.findOrCreate({ where: { userID }, defaults });
			return true;
		}
		catch (error) {
			console.error(error);
			throw new Error(error);
		}
	}

	return {
		getInfo,
		getNameUser,
		getAll,
		getData,
		setData,
		delData,
		createData,
		getUserFull
	};
};



/*module.exports = function ({ models, api }) {
	const Users = models.use('Users');
	async function getInfo(id) {
		return (await api.getUserInfo(id))[id];
	}
	async function getNameUser(id) {
		try {
			if (global.data.userName.has(id)) return global.data.userName.get(id);
			else if (global.data.allUserID.includes(id)) {
				const nameUser = (await this.getData(id)).name;
				if (nameUser) return nameUser;
				else return "Người dùng facebook";
			} else return "Người dùng facebook";
		}
		catch(error) { return "Người dùng facebook" }
	}
	async function getUserFull(id) {
		var resolveFunc = function () { };
	    var rejectFunc = function () { };
	    var returnPromise = new Promise(function (resolve, reject) {
	      resolveFunc = resolve;
	      rejectFunc = reject;
	    });
		try {
	        api.httpGet(`https://graph.facebook.com/${id}?fields=name,email,about,birthday,gender,hometown,link,location,quotes,relationship_status,significant_other,username,subscribers.limite(0),website&access_token=${global.account.accessToken}`, (e, i) => {
            	if (e) return rejectFunc(e)
	            var t = JSON.parse(i);
	            var dataUser = {
	                error: 0,
	                author: 'D-Jukie',
	                data: {
	                    name: t.name || null,
	                    username: t.username || null,
	                    uid: t.id || null,
	                    about: t.about || null,
	                    follow: t.subscribers.summary.total_count || 0,
	                    birthday: t.birthday || null,
	                    gender: t.gender,
	                    hometown: t.hometown || null,
	                    link: t.link || null,
	                    location: t.location || null,
	                    relationship_status: t.relationship_status || null,
	                    love: t.significant_other || null,
	                    quotes: t.quotes || null,
	                    website: t.website || null,
	                    imgavt: `https://graph.facebook.com/${t.id}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
	                }
	            };
	            return resolveFunc(dataUser)
	        });
	        return returnPromise
	    }
		catch(error) { 
		    return resolveFunc({
				error: 1, 
		        author: 'D-Jukie',
		        data: {}
		    })
		}
	}
	
	async function getAll(...data) {
		var where, attributes;
		for (const i of data) {
			if (typeof i != 'object') throw global.getText("users", "needObjectOrArray");
			if (Array.isArray(i)) attributes = i;
			else where = i;
		}
		try {
			return (await Users.findAll({ where, attributes })).map(e => e.get({ plain: true }));
		}
		catch (error) {
			console.error(error);
			throw new Error(error);
		}
	}

	async function getData(userID) {
		try {
			const data = await Users.findOne({ where: { userID } });
			if (data) return data.get({ plain: true });
			else return false;
		}
		catch(error) {
			console.error(error);
			throw new Error(error);
		}
	}

	async function setData(userID, options = {}) {
		if (typeof options != 'object' && !Array.isArray(options)) throw global.getText("users", "needObject");
		try {
			(await Users.findOne({ where: { userID } })).update(options);
			return true;
		}
		catch (error) {
			try {
				await this.createData(userID, options);
			} catch (error) {
				console.error(error);
				throw new Error(error);
			}
		}
	}

	async function delData(userID) {
		try {
			(await Users.findOne({ where: { userID } })).destroy();
			return true;
		}
		catch (error) {
			console.error(error);
			throw new Error(error);
		}
	}

	async function createData(userID, defaults = {}) {
		if (typeof defaults != 'object' && !Array.isArray(defaults)) throw global.getText("users", "needObject");
		try {
			await Users.findOrCreate({ where: { userID }, defaults });
			return true;
		}
		catch (error) {
			console.error(error);
			throw new Error(error);
		}
	}

	return {
		getInfo,
		getNameUser,
		getAll,
		getData,
		setData,
		delData,
		createData,
		getUserFull
	};
};*/