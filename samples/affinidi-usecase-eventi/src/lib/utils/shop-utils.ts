export const getGeoSpecificPrice = (price: any, currencyRate: any, verifiedUser: any) => {
    const actualPrice = (price * currencyRate);
    const discount = (price * 0.1 * currencyRate);
    return verifiedUser ? (actualPrice - discount).toFixed(2) : actualPrice.toFixed(2);
};