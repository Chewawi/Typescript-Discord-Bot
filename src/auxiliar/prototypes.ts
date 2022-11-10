export const Loader = () => {
	Number.prototype.toReadable = function () {
		return this.toLocaleString('en-US')
	}
	String.prototype.toFormalCase = function () {
		return this.charAt(0).toUpperCase() + this.slice(1)
	}
}
