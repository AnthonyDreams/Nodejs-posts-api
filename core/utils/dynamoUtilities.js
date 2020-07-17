exports.updateExpresion = (sanitizedData) => {
    var update_expression = "SET "
    var values_expression = {}
    var attributes_names = {}
    const keys = Object.keys(sanitizedData)
    keys.forEach((key, index) => {
        update_expression += index == keys.length - 1 ? `#${key} = :${key}` : `#${key} = :${key}, `
        values_expression[`:${key}`] = sanitizedData[key]
        attributes_names[`#${key}`] = key
    })

    return {
        update_expresion_string : update_expression,
        attributes_values : values_expression,
        attributes_names : attributes_names

    }

}


exports.filterExpression = (search_data) => {
    var condition_expression = ""
    var values_expression = {}
    var attributes_names = {}
    const keys = Object.keys(search_data)
    keys.forEach((key, index) => {
        condition_expression += index == keys.length - 1 ? `#${key} = :${key}` : `#${key} = :${key}, `
        values_expression[`:${key}`] = search_data[key]
        attributes_names[`#${key}`] = key
    })

    return {
        condition_expression : condition_expression,
        attributes_values : values_expression,
        attributes_names : attributes_names

    }
}