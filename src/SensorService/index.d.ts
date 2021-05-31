/**
 * Provides access to background sensor reading service.
 */
declare module SensorService{
	/**
	 * Lmao readme
	 * @param a A string
	 */
	function myFunction(a: string): string;
	function myOtherFunction(a: number): number;
	/*~ You can declare types that are available via importing the module */
	interface SomeType {
		name: string;
		length: number;
		extras?: string[];
	}
	/*~ You can declare properties of the module using const, let, or var */
	const myField: number;

	function getSecret(ans: number): Promise<string>;
}

export default SensorService;