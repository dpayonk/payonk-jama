import Logger from "../Logger";


class SerializationMixin {
    static convertToCamelCase: (json_data: any) => any;
    static toCamel: (s: any) => any;
    logger: Logger = new Logger();

    hydrate(json: Object){
        for (var sourceKey in json) {
            // check if target has that property
            if (this.hasOwnProperty(sourceKey)) {        
                this[sourceKey] = json[sourceKey];
            } else {
                this.logger.warn(`${this.constructor.name} has no property: ${sourceKey}`)
            }
        }        
    }
}

SerializationMixin.toCamel = (s: any) => {
    return s.replace(/([-_][a-z])/ig, ($1) => {
        return $1.toUpperCase()
            .replace('-', '')
            .replace('_', '');
    });
};

SerializationMixin.convertToCamelCase = (jsonData: any) => {
    let camelVersion = {};
    for (var key in jsonData) {
        if (jsonData.hasOwnProperty(key)) {
            let camelCase = SerializationMixin.toCamel(key);
            camelVersion[camelCase] = jsonData[key];
        }
    }
    return camelVersion;
}

export default SerializationMixin;