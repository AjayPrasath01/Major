export default (setData) => {
    setData((previous) => {
        const newData = previous.map((value) => {
            return { ...value, isChecked: false };
        });
        return newData;
    });
}