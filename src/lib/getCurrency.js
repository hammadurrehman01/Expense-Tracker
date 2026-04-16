const getCurrency = async () => {
    try {
        const response = await axios.get("https://ipwho.is/");

        const country = response.data.country;

        const countryData = await axios.get(`https://restcountries.com/v3.1/name/${country}`);

        const currencies = countryData.data[0].currencies;
        const currencyCode = Object.keys(currencies)[0];
        const currencySymbol = currencies[currencyCode].symbol;

        return { currencyCode, currencySymbol };
    } catch (error) {
        console.log("error ==>", error.message);
    }
}

export default getCurrency;