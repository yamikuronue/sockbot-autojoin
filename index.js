const debug = require('debug')('sockbot:autojoin');
const defaultConfig = {
    'channels': []
}
/**
 * Plugin generation function.
 *
 * Returns a plugin object bound to the provided forum provider
 *
 * @param {Provider} forum Active forum Provider
 * @param {object|Array} config Plugin configuration
 * @returns {Plugin} An instance of the OfficeHours plugin
 */
module.exports = function officeHours(forum, cfg) {
    const config = {
       'channels': cfg.channels || defaultConfig.channels
   };
    
    /**
     * Activate the plugin
     */
    function activate() {
        const promises = cfg.channels.map((item) => {
             forum.Topic.getByName(item)
                .then((top) => top.join());
        });
        return Promise.all(promises);
    }

    /**
     * Deactivate the plugin
     */
    function deactivate() {
        const promises = cfg.channels.map((item) => {
            debug('joining ' + item);
             forum.Topic.getByName(item)
                .then((top) => top.part());
            });
        return Promise.all(promises);
    }

    return {
        activate: activate,
        deactivate: deactivate,
        cfg: config
    };
};