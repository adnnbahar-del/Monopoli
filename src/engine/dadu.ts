/**
 * Engine Dadu Monopoli MONOPECA
 * Menggunakan crypto.getRandomValues untuk memastikan keacakan kriptografis yang adil dan merata.
 */

export function lemparDadu(): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return (array[0] % 6) + 1;
}

/**
 * Fungsi simulasi untuk menguji distribusi lemparan dadu.
 */
export function simulasiDistribusiDadu(totalLemparan: number = 6000): Record<number, number> {
  const hasil: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0
  };

  const buffer = new Uint32Array(1000);
  let lemparanSisa = totalLemparan;

  while (lemparanSisa > 0) {
    const batchSize = Math.min(lemparanSisa, buffer.length);
    const subBuffer = buffer.subarray(0, batchSize);
    crypto.getRandomValues(subBuffer);

    for (let i = 0; i < batchSize; i++) {
      const angka = (subBuffer[i] % 6) + 1;
      hasil[angka]++;
    }
    lemparanSisa -= batchSize;
  }

  return hasil;
}
