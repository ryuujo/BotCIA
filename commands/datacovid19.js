const axios = require('axios');
const moment = require('moment');

module.exports = {
  name: 'datacovid19',
  description: 'Info data Covid-19',
  async execute(message) {
    moment.locale('id');
    const timeFormat = 'Do MMMM YYYY, HH:mm Z';
    try {
      const dataIndonesia = await axios.get(
        'https://api.kawalcovid19.id/v1/api/case/summary'
      );
      const positifGlobal = await axios.get(
        'https://api.kawalcorona.com/positif'
      );
      const sembuhGlobal = await axios.get(
        'https://api.kawalcorona.com/sembuh'
      );
      const meninggalGlobal = await axios.get(
        'https://api.kawalcorona.com/meninggal'
      );
      sembuhGlobal.data.inline = true;
      meninggalGlobal.data.inline = true;
      const generalEmbed = {
        color: 0xed1d24,
        description:
          'Menampilkan informasi status COVID-19 di Indonesia dan Dunia.',
        author: {
          name: 'Kawal COVID-19 #StayAtHome',
          url: 'https://kawalcorona.com/',
        },
        thumbnail: {
          url: 'https://kawalcovid19.id/android-chrome-192x192.png',
        },
        fields: [
          {
            name: 'Jumlah positif di Indonesia',
            value: dataIndonesia.data.confirmed.toLocaleString(),
          },
          {
            name: 'Dalam Perawatan',
            value: dataIndonesia.data.activeCare.toLocaleString(),
            inline: true,
          },
          {
            name: 'Sembuh',
            value: dataIndonesia.data.recovered.toLocaleString(),
            inline: true,
          },
          {
            name: 'Meninggal',
            value: dataIndonesia.data.deceased.toLocaleString(),
            inline: true,
          },
          positifGlobal.data,
          sembuhGlobal.data,
          meninggalGlobal.data,
          {
            name: 'Laporan Update Terakhir',
            value: moment(dataIndonesia.data.metadata.lastUpdatedAt)
              .utcOffset('+07:00')
              .format(timeFormat),
          },
        ],
        footer: {
          text: 'Data diambil melalui website https://kawalcovid19.id',
        },
      };
      return await message.channel.send(
        'Berikut adalah hasil terakhir laporan COVID-19',
        { embed: generalEmbed }
      );
    } catch (err) {
      message.channel.send('Ada sesuatu yang salah, tapi itu bukan kamu')
      console.log(err);
    }
  },
};
