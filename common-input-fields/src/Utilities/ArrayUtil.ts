export default class ArrayUtil {
	public static FromNodeList<T extends Node>(list: NodeListOf<T>): T[] {
		return Array.prototype.concat.apply([], list as any);
	}

}
