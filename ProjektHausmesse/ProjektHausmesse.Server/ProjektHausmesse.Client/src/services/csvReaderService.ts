import Papa from 'papaparse';

class CsvReaderService {

  public async getStreetNames(path: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(path, {
        download: true,
        header: true,
        complete: (results) => {
          const streetNames = results.data.map((row: any) => row.Name);
          resolve(streetNames.filter(name => name)); // Filter out empty strings
        },
        error: (error: any) => {
          reject(error);
        }
      });
    });
  }


}

export const csvReaderService = new CsvReaderService();
