const https = require('https');

import youtubeConfig from '../config/youtube';

interface IRequest {
  term: string;
}

interface IRequestFiveMostUsedWords {
  items: [];
}

class ShowSearchService {
  public async execute({ term }: IRequest): Promise<any> {
    const { url, key } = youtubeConfig.youtube;

    const options = {
      hostname: url,
      port: 443,
      path: `/youtube/v3/search?part=snippet&q=${term}&key=${key}&maxResults=20`,
      method: 'GET',
    };

    return new Promise((resolve, reject) => {
      https
        .request(options, function (res: any) {
          res.setEncoding('utf8');
          var body = '';

          res.on('data', function (chunk: any) {
            body += chunk;
          });

          res.on('end', function () {
            var response = JSON.parse(body);
            resolve(response.items);
          });
        })
        .end();
    });
  }

  public async searchFiveMostUsedWords({
    items,
  }: IRequestFiveMostUsedWords): Promise<any> {
    var words: string[] = [];

    // put the words of the description and title into the array
    items.forEach(function (value: any) {
      const { title, description } = value.snippet;

      words = words.concat(
        title.toLowerCase().split(' '),
        description.toLowerCase().split(' '),
      );
    });

    const occurringWords = this.countWords(words);

    const orderedWords = this.sortByValue(occurringWords as []);

    return orderedWords.slice(Math.max(orderedWords.length - 5, 1));
  }

  public countWords(occurringWords: string[]) {
    var obj = {};
    occurringWords.forEach(function (value: any) {
      value = value.replace(/[^A-Z^]/gi, '');

      if (value && value.length > 1) {
        if (!obj[value]) obj[value] = 0;
        obj[value]++;
      }
    });

    return obj;
  }

  public sortByValue(wordsCount = []) {
    var sortable = [];
    for (var item in wordsCount) {
      sortable.push({ word: item, repetitionNumber: wordsCount[item] });
    }

    sortable.sort(function (a, b) {
      return parseInt(a.repetitionNumber) - parseInt(b.repetitionNumber);
    });

    return sortable;
  }
}

export default ShowSearchService;
