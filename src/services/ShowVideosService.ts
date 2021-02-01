const https = require('https');
const hmh = require('hmh');

import youtubeConfig from '../config/youtube';

interface IRequest {
  items: [];
  dailyTime: string;
}

interface IRequestVideoDetails {
  videoIds: string;
}

class ShowVideosService {
  public async execute({ items, dailyTime }: IRequest): Promise<any> {
    var videoIds: string[] = [];

    var daysWeekWatchMovie = [
      {
        dayWeek: 'Segunda-feira',
        minutes: 0,
        videoIds: [] as any,
      },
      {
        dayWeek: 'Terça-feira',
        minutes: 0,
        videoIds: [] as any,
      },
      {
        dayWeek: 'Quarta-feira',
        minutes: 0,
        videoIds: [] as any,
      },
      {
        dayWeek: 'Quinta-feira',
        minutes: 0,
        videoIds: [] as any,
      },
      {
        dayWeek: 'Sexta-feira',
        minutes: 0,
        videoIds: [] as any,
      },
      {
        dayWeek: 'Sábado',
        minutes: 0,
        videoIds: [] as any,
      },
      {
        dayWeek: 'Domingo',
        minutes: 0,
        videoIds: [] as any,
      },
    ];

    items.forEach(function (value: any) {
      if (value.id.videoId) {
        videoIds.push(value.id.videoId);
      }
    });

    const searchDetails = await this.executeSearchDetails({
      videoIds: videoIds.join(),
    });

    console.log(daysWeekWatchMovie);

    var indexDay = 0;
    searchDetails.forEach(function (value: any) {
      if (value.contentDetails.duration) {
        const videoTime = value.contentDetails.duration
          .replace('PT', '')
          .replace('S', '')
          .split('M');

        const formattedTime = hmh.sum(`${videoTime[0]}m ${videoTime[1]}s`).m;

        if (formattedTime > dailyTime || !formattedTime) {
          return;
        }

        const aux = daysWeekWatchMovie[indexDay].minutes + formattedTime;
        if (aux > dailyTime) {
          indexDay++;
        }

        if (indexDay > 6) {
          return;
        }

        daysWeekWatchMovie[indexDay].minutes += formattedTime;
        daysWeekWatchMovie[indexDay].videoIds.push(value.id);
      }
    });

    return daysWeekWatchMovie;
  }

  public async executeSearchDetails({
    videoIds,
  }: IRequestVideoDetails): Promise<any> {
    const { url, key } = youtubeConfig.youtube;

    const options = {
      hostname: url,
      port: 443,
      path: `/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${key}&maxResults=20`,
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
}

export default ShowVideosService;
