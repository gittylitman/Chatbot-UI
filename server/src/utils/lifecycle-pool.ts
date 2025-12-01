/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Example usage:
 * ```
 * const [createLedgerRecord, destroyLedgerRecords] = createPool(
 *   async (values: Partial<JournalEntry> | void) =>
 *     (
 *       await prismaService.journalEntry.create({
 *         data: {
 *           type: 'CHARGE',
 *           amount: 0,
 *           accountType: 'SELLER',
 *           currency: 'USD',
 *           side: 'CREDIT',
 *           accountId: '',
 *           eventId: '',
 *           ...values,
 *         },
 *       })
 *     ).id,
 *   (ids: number[]) =>
 *     prismaService.journalEntry.deleteMany({
 *       where: {
 *         id: { in: ids },
 *       },
 *     }),
 *   );
 * ```
 * @param builder Function that builds something to add to the pool. Returns an identifier.
 * @param destroyer Function that destroys everything in the pool. Given identifiers.
 * @returns [create, destroy] functions. Create is used to add to the pool. Destroy is used to destroy the pool contents.
 */
export function createPool<T, I, D>(
  builder: (values?: Partial<T>, ...rest: any) => Promise<I>,
  destroyer: (ids: I[]) => Promise<D>,
): [(values?: Partial<T>, ...rest: any) => Promise<I>, () => Promise<D>] {
  const idPool: I[] = [];
  const create = async (values?: Partial<T>, ...rest: any[]) => {
    const id = await builder(values, ...rest);
    idPool.push(id);
    return id;
  };
  const destroy = () => {
    const ids = [...idPool];
    idPool.splice(0, idPool.length);
    return destroyer(ids);
  };
  return [create, destroy];
}
