type FullyTypedPromise<T, F = any> = {
    catch<TResult = never>(
        onrejected?: ((reason: F) => TResult | PromiseLike<TResult>) | undefined | null
    ): Promise<T | TResult>;
} & Promise<T>;

export default FullyTypedPromise;