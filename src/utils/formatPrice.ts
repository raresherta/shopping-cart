const currency_formatter = new Intl.NumberFormat(undefined, {
	currency: 'GBP',
	style: 'currency'
});

export function formatPrice(number: number) {
	return currency_formatter.format(number);
}
