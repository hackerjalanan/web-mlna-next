
import type { Lang } from "./types";

export const LANGS: { id: Lang; name: string; flag: string }[] = [
  { id: "id", name: "Indonesia", flag: "🇮🇩" },
  { id: "en", name: "Inggris", flag: "🇬🇧" },
];

export const DURATIONS = [15, 30, 60, 120];

const WORDS: Record<Lang, string[]> = {
  id: `
    yang dan di ke dari untuk dengan ini itu pada adalah dalam tidak akan juga
    atau saya kami kita mereka anda dia sudah belum bisa harus ingin mau lebih
    sangat banyak sedikit besar kecil baru lama baik cepat lambat sedang selalu
    sering jarang pernah mungkin pasti semua setiap beberapa seluruh sebagian
    rumah sekolah kantor kota desa jalan pasar kerja belajar bermain makan minum
    tidur bangun pagi siang sore malam hari minggu bulan tahun waktu uang buku
    meja kursi pintu jendela air api angin tanah langit laut gunung sungai hutan
    pohon bunga hujan matahari bintang awan udara batu pasir rumput daun akar
    teman keluarga ibu bapak ayah anak guru murid dokter petani nelayan polisi
    tentara pegawai pekerja penulis pembaca pengusaha manusia orang perempuan
    laki laki saudara kakak adik nenek kakek paman bibi sepupu tetangga sahabat
    senyum tertawa berjalan berlari melihat mendengar berpikir menulis membaca
    bertanya menjawab mencoba berhasil gagal membuat mencari menemukan membawa
    mengambil memberikan menerima membuka menutup membeli menjual memasak
    mencuci membersihkan membantu menjaga menggunakan memilih memulai mengakhiri
    bekerja beristirahat bermain berlatih berbicara mendengarkan memahami
    mengerti mengingat melupakan merencanakan mengembangkan memperbaiki
    mengubah membangun menciptakan menghasilkan mengirim menerima menghubungi
    teknologi komputer laptop internet jaringan aplikasi website perangkat
    sistem program kode data digital informasi halaman tombol layar keyboard
    mouse server database bahasa desain gambar video suara musik kamera ponsel
    telepon pesan email file folder dokumen proyek pekerjaan bisnis perusahaan
    produk layanan pelanggan pengguna keamanan kualitas proses hasil tujuan
    rencana ide solusi masalah pertanyaan jawaban pilihan keputusan kesempatan
    pengalaman pengetahuan kemampuan keterampilan pendidikan kesehatan olahraga
    sepakbola basket badminton renang lari sepeda kendaraan mobil motor kereta
    pesawat kapal perjalanan liburan wisata pantai taman restoran makanan
    minuman kopi teh nasi ikan ayam daging telur sayur buah roti susu gula garam
    pedas manis asin pahit segar hangat dingin panas bersih kotor nyaman aman
    indah cantik tampan kuat lemah sehat sakit mudah sulit sederhana penting
    menarik menyenangkan menyedihkan bahagia senang sedih marah takut tenang
    sabar berani ramah sopan jujur adil bijak pintar cerdas kreatif aktif produktif
    pagi cerah gelap terang gelap warna merah biru hijau kuning putih hitam abu
    cokelat ungu jingga merah muda angka nomor jumlah nilai harga biaya gratis
    mahal murah tinggi rendah panjang pendek lebar sempit dekat jauh kanan kiri
    atas bawah depan belakang tengah samping luar dalam awal akhir pertama kedua
    ketiga terakhir berikut kemarin besok sekarang nanti dahulu segera perlahan
    bersama sendiri berbeda sama benar salah tepat cepat lambat cukup kurang
    penuh kosong banyak sedikit utama umum khusus sederhana lengkap terbuka
    tertutup bebas tersedia siap mungkin tentu penting perlu wajib pilihan
    kehidupan dunia alam lingkungan masyarakat negara bangsa rakyat pemerintah
    budaya tradisi sejarah masa depan perubahan perkembangan kemajuan teknologi
    ekonomi keuangan perdagangan pertanian industri transportasi komunikasi
    olahraga kesehatan pendidikan penelitian ilmu sains matematika fisika kimia
    seni sastra budaya berita informasi media publik pribadi resmi nasional
    internasional daerah wilayah provinsi kabupaten kecamatan kelurahan desa
    rumah tangga dapur kamar ruang halaman atap lantai dinding pagar jembatan
    gedung bangunan toko warung pasar terminal stasiun bandara pelabuhan
    sekolah kampus universitas perpustakaan laboratorium rumah sakit klinik
    apotek bank kantor hotel penginapan tempat lokasi alamat lingkungan
    pagi hari siang hari sore hari malam hari akhir pekan hari kerja
  `.trim().split(/\s+/),

  en: `
    the be to of and a in that have it for not on with he as you do at this
    but his by from they we say her she or an will my one all would there
    their what so up out if about who get which go me when make can like time
    no just him know take people into year your good some could them see other
    than then now look only come its over think also back after use two how
    our work first well way even new want because any these give day most us
    is are was were been being has had did does done may might must shall
    should would could can need need to want wish hope try keep let put set
    run move turn start stop open close read write speak listen watch learn
    teach study build create make find search discover develop improve change
    help support share show tell ask answer call send receive bring carry
    hold leave stay wait follow lead choose decide remember forget understand
    believe become seem feel hear see smell touch walk run jump sit stand sleep
    wake eat drink cook clean wash drive ride travel visit meet talk play work
    live love enjoy smile laugh cry think dream plan grow grow up begin finish
    complete continue return follow reach pass check test save load update
    delete remove add edit copy paste move select type press click scroll
    computer laptop keyboard screen monitor mouse phone tablet device
    technology internet website browser application software hardware network
    server database program programming coding developer designer engineer
    digital data information system platform account profile password security
    privacy settings option feature function service product project business
    company customer client user team member manager worker employee office
    school college university student teacher doctor nurse farmer driver
    artist writer reader friend family mother father parent child brother
    sister uncle aunt cousin grandfather grandmother people person man woman
    boy girl baby human community society country city village world nation
    home house room kitchen bedroom bathroom door window wall floor ceiling
    table chair desk bed sofa lamp light fan computer book paper pen pencil
    bag box bottle glass cup plate spoon fork knife food meal breakfast lunch
    dinner snack rice bread meat chicken fish egg vegetable fruit apple orange
    banana mango grape lemon milk water coffee tea juice sugar salt pepper
    sweet bitter sour fresh delicious healthy hungry thirsty hot cold warm cool
    weather rain snow wind storm cloud sky sun moon star space earth ocean sea
    river lake mountain forest tree flower grass leaf garden animal bird cat
    dog horse cow sheep goat rabbit fish insect nature environment energy
    fire air water earth stone sand metal wood plastic glass material
    road street bridge building store shop market bank hospital clinic
    pharmacy restaurant hotel airport station port school library museum park
    beach mountain village town country capital region place location address
    car bus train plane ship bicycle motorcycle truck taxi vehicle journey
    travel holiday vacation trip adventure ticket passport luggage map route
    morning afternoon evening night today tomorrow yesterday weekend weekday
    monday tuesday wednesday thursday friday saturday sunday january february
    march april may june july august september october november december
    hour minute second moment period season spring summer autumn winter
    happy sad angry afraid calm excited tired busy free ready strong weak
    healthy sick safe dangerous easy difficult simple complex important useful
    beautiful lovely wonderful amazing excellent perfect great awesome nice
    kind friendly honest brave clever smart creative active productive careful
    fast slow quick early late high low long short wide narrow big small large
    little heavy light thick thin deep shallow near far close distant right
    left top bottom front back inside outside above below around between
    center middle side first second third last next previous final new old
    young modern ancient fresh clean dirty clear dark bright colorful black
    white red blue green yellow orange purple pink brown gray silver gold
    number amount total value price cost money cash payment account budget
    market trade economy finance investment salary income profit loss result
    goal purpose reason idea solution problem question answer choice decision
    opportunity experience knowledge skill ability talent education science
    research history culture art music movie photo picture image video sound
    voice language word sentence paragraph story message email letter document
    file folder page button link menu icon logo design color style layout
    content title heading section header footer sidebar navbar component
    responsive mobile desktop tablet application website frontend backend
    javascript typescript react nextjs html css tailwind node database api
    git github terminal command package module library framework function
    variable object array string number boolean promise async await import export
    code debug error warning success failure loading progress status result
    performance speed memory storage cache server hosting domain deployment
    version update release test quality standard practice method process
    system structure architecture interface interaction animation transition
    effect state props component hook render event handler callback
    input output form submit validation message notification alert
    login logout register profile dashboard settings account authentication
    authorization permission access control backup restore recovery
    start finish continue reset restart pause resume stop complete
    available unavailable enabled disabled active inactive online offline
    public private personal general special common different similar
    correct incorrect true false possible impossible certain unknown
    always usually often sometimes rarely never again already still yet
    together alone perhaps maybe probably certainly really very quite
    more most less least enough extra additional basic advanced professional
    beginner intermediate expert local global national international
    morning sunlight daylight midnight sunrise sunset atmosphere temperature
    direction distance measurement weight height length width size shape
    health fitness exercise training sport football basketball badminton
    swimming running walking cycling strength balance flexibility energy
    success progress growth development improvement achievement
    attention focus concentration motivation discipline consistency
    patience confidence courage respect trust kindness honesty responsibility
    freedom peace happiness friendship relationship conversation connection
    community teamwork cooperation communication collaboration
  `.trim().split(/\s+/),
};

export function makeWords(lang: Lang, count: number) {
  const source = WORDS[lang];
  const result: string[] = [];

  if (!source || source.length === 0) return result;

  while (result.length < count) {
    // Acak seluruh stok kata sebelum digunakan
    const shuffled = [...source];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Masukkan kata sampai jumlah yang dibutuhkan terpenuhi
    for (const word of shuffled) {
      if (result.length >= count) break;

      // Hindari kata yang sama secara berurutan
      if (word === result[result.length - 1] && shuffled.length > 1) {
        continue;
      }

      result.push(word);
    }
  }

  return result;
}
