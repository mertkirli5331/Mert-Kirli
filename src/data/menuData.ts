import { WeekMenu, DayId, DayMenu } from '../types';

// Diverse curated school dishes to build 30 unique, authentic weeks
const soupPool = [
  'Süzme Mercimek Çorbası',
  'Ezogelin Çorbası',
  'Yayla Çorbası',
  'Domates Çorbası (Kaşarlı)',
  'Anadolu Tarhana Çorbası',
  'Tavuk Suyu Şehriye Çorbası',
  'Kremalı Mantar Çorbası',
  'Sebze Çorbası',
  'Tutmaç Çorbası',
  'Düğün Çorbası',
  'Kelle Paça Usulü Terbiyeli Çorba',
  'Havuçlu Kabak Çorbası',
];

const mainPool = [
  'Fırında Anne Köftesi & Patates',
  'Geleneksel Kuru Fasulye',
  'Fırın Tavuk Baget & Garnitür',
  'Orman Kebabı',
  'Kıymalı Bezelye Yemeği',
  'Etli Nohut Yemeği',
  'Fırında Somon / Mezgit Balığı',
  'Kıymalı Karnıyarık',
  'Soslu Tavuk Sote',
  'Zeytinyağlı Biber Dolması & Yoğurt',
  'Hünkâr Beğendi',
  'Dana Rosto & Püre',
  'Sebzeli Piliç Roti',
  'Etli Taze Fasulye',
  'Fırında İzmir Köfte',
  'Kıymalı Tepsi Böreği',
  'Kremalı Tavuk Fajita',
  'Etli Kış Güveci',
  'Fırında Kaşarlı Tavuk Şnitzel',
  'Zeytinyağlı Enginar & Garnitür',
];

const sidePool = [
  'Tereyağlı Şehriyeli Pirinç Pilavı',
  'Meyhane Usulü Bulgur Pilavı',
  'Fırında Fesleğenli Makarna',
  'Kuskus Pilavı',
  'Patates Püresi',
  'Arpa Şehriye Pilavı',
  'Soslu Spagetti',
  'Sebzeli Bulgur Pilavı',
  'Peynirli Su Böreği Dilimi',
  'Fırınlanmış Baharatlı Elma Dilim Patates',
];

const extraPool = [
  'Naneli Yayık Ayran & Mevsim Salata',
  'Havuçlu Mor Lahana Salatası & Cacık',
  'Fırın Sütlaç',
  'Kemalpaşa Tatlısı',
  'Cevizli İrmik Helvası',
  'Mevsim Meyvesi (Amasya Elması)',
  'Taze Mandalina & Muz',
  'Kakaolu Ev Pudingi',
  'Kuru Üzümlü Komposto',
  'Çoban Salata & Yoğurt',
  'Supangle Tatlısı',
  'Karanfilli Elma Kompostosu',
];

const snackPool = [
  'Ceviz İçi, Kuru Kayısı & Taze Süt',
  'Ev Yapımı Havuçlu Tarçınlı Kek & Ihlamur',
  'Kaşarlı Simit & Ayran',
  'Taze Muz & Çiğ Fındık',
  'Meyveli Yoğurt & Yulaf Ezmesi',
  'Peynirli Mini Poğaça & Doğal Elma Suyu',
  'Çiğ Badem, Kuru İncir & Süt',
  'Ev Poğaçası & Doğal Kuşburnu Çayı',
  'Tam Tahıllı Grissini & Labne Peynir',
  'Ev Yapımı Pankek & Bal',
];

const weekThemes = [
  'Yeni Eğitim Yılına Merhaba & Enerji Menüsü',
  'Sağlıklı Akdeniz Lezzetleri',
  'Geleneksel Türk Mutfağı Klasikleri',
  'Vitamin Deposu Sonbahar Menüsü',
  'Bağışıklık Güçlendirici Lezzetler',
  'Omega-3 & Zihin Açıcı Besinler',
  'Protein & Büyüme Desteği Haftası',
  'Kalsiyum & Kemik Gelişimi Menüsü',
  '1. Ara Tatil Öncesi Moral Menüsü',
  'Kışa Hazırlık ve Sıcak Çorbalar',
  'Gökkuşağı Renklerinde Taze Sebzeler',
  'Sınavlara Hazırlık Odaklanma Menüsü',
  'Geleneksel Bakliyat Şöleni',
  'Ev Yapımı Anne Yemekleri',
  '1. Dönem Finali & Başarı Kutlaması',
  '2. Dönem Başlangıcı Taze Enerji',
  'Kış Güneşi Narenciye & C Vitamini',
  'Sporcu ve Hareketli Günler Menüsü',
  'Bahar Müjdesi & Hafif Tatlar',
  'Zeytinyağlılar & Ege Rüzgarı',
  'Zihinsel Zindelik & Odaklanma',
  '2. Ara Tatil Öncesi Renkli Tabaklar',
  'Bahar Sebzeleri ve Taze Yeşillikler',
  'Geleceğin Yıldızları Güç Menüsü',
  'Geleneksel Anadolu Lezzetleri',
  'Çocukların En Sevdiği Seçkiler',
  'Yıl Sonu Proje Haftası Motivasyon Menüsü',
  'Doğal ve Katkısız Ev Tatları',
  'Yaz Başlangıcı Ferah Lezzetler',
  '30. Hafta - Mezuniyet & Yaz Tatiline Uğurlama Şöleni',
];

const dayNames: { id: DayId; name: string }[] = [
  { id: 'mon', name: '1. Gün' },
  { id: 'tue', name: '2. Gün' },
  { id: 'wed', name: '3. Gün' },
  { id: 'thu', name: '4. Gün' },
  { id: 'fri', name: '5. Gün' },
];

function generate30Weeks(): WeekMenu[] {
  const weeks: WeekMenu[] = [];

  for (let w = 1; w <= 30; w++) {
    const semester: 1 | 2 = w <= 15 ? 1 : 2;
    const theme = weekThemes[w - 1] || `${w}. Hafta Dengeli Okul Menüsü`;

    const daysRecord = {} as Record<DayId, DayMenu>;

    dayNames.forEach((d, dayIndex) => {
      // Deterministic but diverse selection for each week & day
      const seed = (w * 7 + dayIndex * 13) % 100;
      const soup = soupPool[(w + dayIndex) % soupPool.length];
      const main = mainPool[(w * 2 + dayIndex) % mainPool.length];
      const side = sidePool[(w + dayIndex * 2) % sidePool.length];
      const extra = extraPool[(w * 3 + dayIndex) % extraPool.length];
      const snack = snackPool[(w + dayIndex * 3) % snackPool.length];

      // Realistic calories 680 - 820 kcal for growing students
      const calories = 690 + ((seed * 3) % 130);

      // Allergens
      const allergens: string[] = ['Gluten'];
      if (main.includes('Tavuk') || main.includes('Köfte') || extra.includes('Süt') || soup.includes('Yayla') || soup.includes('Kaşarlı')) {
        allergens.push('Süt Ürünleri');
      }
      if (main.includes('Balık') || main.includes('Somon')) {
        allergens.push('Balık');
      }
      if (snack.includes('Ceviz') || snack.includes('Fındık') || snack.includes('Badem')) {
        allergens.push('Kuruyemiş');
      }

      daysRecord[d.id] = {
        dayId: d.id,
        dayName: d.name,
        soup,
        main,
        side,
        extra,
        snack,
        calories,
        allergens,
      };
    });

    weeks.push({
      weekNumber: w,
      semester,
      theme,
      dateRange: `${w}. Akademik Hafta (${semester}. Dönem)`,
      days: daysRecord,
    });
  }

  return weeks;
}

export const initial30WeeksMenu: WeekMenu[] = generate30Weeks();
