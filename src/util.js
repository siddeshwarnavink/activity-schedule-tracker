export const array_insert = (array, value, position) => ([
    ...[...array].splice(0, position + 1),
    value,
    ...[...array].splice(position + 1, array.length)
]);

export const array_move = (array, fromIndex, toIndex) => {
    const updatedArray = [...array];

    updatedArray[fromIndex] = array[toIndex];
    updatedArray[toIndex] = array[fromIndex];

    return updatedArray;
}