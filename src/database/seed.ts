import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { Cart } from '../features/cart/entities/cart.entity';
import { CartItem } from '../features/cart/entities/cart-item.entity';
import { Order } from '../features/orders/entities/order.entity';
import { OrderItem } from '../features/orders/entities/order-item.entity';
import {
  Product,
  ProductCategory,
} from '../features/products/entities/product.entity';
import { User, UserRole } from '../features/users/entities/user.entity';

config();

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'commerce_store',
  entities: [User, Product, Cart, CartItem, Order, OrderItem],
  synchronize: false,
});

async function seed() {
  await dataSource.initialize();
  console.log('DB 연결 완료');

  const userRepo = dataSource.getRepository(User);
  const productRepo = dataSource.getRepository(Product);
  const cartRepo = dataSource.getRepository(Cart);

  // 유저 생성
  const usersData = [
    {
      email: 'admin@example.com',
      password: 'Admin1234!',
      name: '관리자',
      role: UserRole.ADMIN,
    },
    {
      email: 'user1@example.com',
      password: 'User1234!',
      name: '홍길동',
      role: UserRole.USER,
    },
    {
      email: 'user2@example.com',
      password: 'User1234!',
      name: '김철수',
      role: UserRole.USER,
    },
  ];

  for (const data of usersData) {
    const existing = await userRepo.findOne({ where: { email: data.email } });
    if (existing) {
      console.log(`유저 이미 존재: ${data.email}`);
      continue;
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = userRepo.create({ ...data, password: hashedPassword });
    const savedUser = await userRepo.save(user);

    if (data.role === UserRole.USER) {
      const cart = cartRepo.create({ userId: savedUser.id });
      await cartRepo.save(cart);
    }
    console.log(`유저 생성: ${data.email}`);
  }

  // 상품 생성
  const productsData: Partial<Product>[] = [
    // FOOD (6개)
    {
      name: '프리미엄 아카시아 꿀 선물세트',
      description: '국내산 100% 아카시아 꿀 2병 구성, 결혼·돌잔치 답례품으로 인기',
      price: 35000,
      originalPrice: 42000,
      stock: 200,
      category: ProductCategory.FOOD,
      imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80',
    },
    {
      name: '정관장 홍삼정 에브리타임 10ml×30포',
      description: '6년근 홍삼 농축액, 간편한 스틱형 포장',
      price: 55000,
      originalPrice: 68000,
      stock: 150,
      category: ProductCategory.FOOD,
      imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80',
    },
    {
      name: '제주 유기농 녹차 선물세트',
      description: '제주산 유기농 녹차 티백 50개입, 고급 선물 박스 포함',
      price: 28000,
      originalPrice: 35000,
      stock: 180,
      category: ProductCategory.FOOD,
      imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80',
    },
    {
      name: '수제 한과 선물세트 (대)',
      description: '유과·약과·강정 등 전통 한과 모음, 명절·돌잔치 답례품',
      price: 45000,
      originalPrice: 55000,
      stock: 100,
      category: ProductCategory.FOOD,
      imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&q=80',
    },
    {
      name: '프리미엄 원두커피 선물세트',
      description: '싱글 오리진 원두 3종 드립백 세트, 고급 박스 포장',
      price: 32000,
      originalPrice: 40000,
      stock: 160,
      category: ProductCategory.FOOD,
      imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80',
    },
    {
      name: '유기농 올리브오일 & 발사믹 세트',
      description: '이탈리아산 엑스트라 버진 올리브오일 + 발사믹 식초 2종 세트',
      price: 48000,
      originalPrice: 60000,
      stock: 80,
      category: ProductCategory.FOOD,
      imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80',
    },

    // HOME (5개)
    {
      name: '호텔식 프리미엄 수건 세트 (4매)',
      description: '고급 이집션 코튼 100%, 웨딩·돌잔치 답례품 베스트셀러',
      price: 38000,
      originalPrice: 48000,
      stock: 300,
      category: ProductCategory.HOME,
      imageUrl: 'https://images.unsplash.com/photo-1583845112203-29329902332e?w=400&q=80',
    },
    {
      name: '라탄 디퓨저 & 캔들 선물세트',
      description: '천연 아로마 디퓨저 200ml + 소이 캔들, 우아한 박스 포장',
      price: 42000,
      originalPrice: 52000,
      stock: 120,
      category: ProductCategory.HOME,
      imageUrl: 'https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=400&q=80',
    },
    {
      name: '프리미엄 도마 & 나이프 세트',
      description: '아카시아 원목 도마 + 세라믹 나이프 3종, 주방 선물 세트',
      price: 65000,
      originalPrice: 80000,
      stock: 60,
      category: ProductCategory.HOME,
      imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80',
    },
    {
      name: '고급 도자기 머그컵 2P 세트',
      description: '핸드메이드 도자기 머그컵 2개, 선물 박스 포함',
      price: 35000,
      originalPrice: 44000,
      stock: 140,
      category: ProductCategory.HOME,
      imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&q=80',
    },
    {
      name: '친환경 밀랍 랩 & 실리콘 백 세트',
      description: '천연 밀랍 랩 3종 + 실리콘 지퍼백 5개, 환경친화적 주방 선물',
      price: 28000,
      stock: 90,
      category: ProductCategory.HOME,
      imageUrl: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&q=80',
    },

    // BEAUTY (5개)
    {
      name: '아로마 핸드크림 선물세트 3종',
      description: '라벤더·로즈·재스민 향 핸드크림 50ml×3, 답례품 베스트',
      price: 25000,
      originalPrice: 32000,
      stock: 250,
      category: ProductCategory.BEAUTY,
      imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80',
    },
    {
      name: '천연 아로마 비누 선물세트 4종',
      description: '유기농 코코넛오일 베이스 수제 비누 4개, 고급 리본 박스',
      price: 22000,
      originalPrice: 28000,
      stock: 200,
      category: ProductCategory.BEAUTY,
      imageUrl: 'https://images.unsplash.com/photo-1600857544200-b2f468e7b140?w=400&q=80',
    },
    {
      name: '바디로션 & 샤워젤 선물세트',
      description: '프리미엄 바디로션 200ml + 샤워젤 200ml, 우아한 선물 구성',
      price: 38000,
      originalPrice: 48000,
      stock: 130,
      category: ProductCategory.BEAUTY,
      imageUrl: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&q=80',
    },
    {
      name: '설화수 윤조에센스 60ml',
      description: '한방 성분의 피부 진정·보습 에센스, 고급 선물 포장 가능',
      price: 85000,
      originalPrice: 95000,
      stock: 50,
      category: ProductCategory.BEAUTY,
      imageUrl: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80',
    },
    {
      name: '립밤 & 핸드크림 미니 선물세트',
      description: '보습 립밤 2종 + 미니 핸드크림 3종, 돌잔치·결혼식 소량 답례품',
      price: 15000,
      originalPrice: 20000,
      stock: 400,
      category: ProductCategory.BEAUTY,
      imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80',
    },

    // KIDS (4개)
    {
      name: '오가닉 신생아 선물세트',
      description: '유기농 면 바디수트·양말·모자 세트, 돌잔치·백일 답례품',
      price: 45000,
      originalPrice: 58000,
      stock: 80,
      category: ProductCategory.KIDS,
      imageUrl: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400&q=80',
    },
    {
      name: '아기 목욕 선물세트',
      description: '유아 전용 샴푸·바디워시·로션 3종, 출산 축하·돌잔치 선물',
      price: 35000,
      originalPrice: 45000,
      stock: 100,
      category: ProductCategory.KIDS,
      imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80',
    },
    {
      name: '원목 자동차 장난감 세트',
      description: '무독성 천연 원목 미니카 6종, 돌잔치 답례품으로 인기',
      price: 28000,
      originalPrice: 35000,
      stock: 120,
      category: ProductCategory.KIDS,
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    },
    {
      name: '아기 사진 액자 선물세트',
      description: '돌사진용 원목 프레임 + 메시지 카드, 백일·돌잔치 기념 답례품',
      price: 32000,
      originalPrice: 40000,
      stock: 90,
      category: ProductCategory.KIDS,
      imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&q=80',
    },

    // FASHION (3개)
    {
      name: '캐시미어 블렌드 머플러',
      description: '부드러운 캐시미어 혼방 머플러, 고급 선물 박스 포장',
      price: 55000,
      originalPrice: 72000,
      stock: 70,
      category: ProductCategory.FASHION,
      imageUrl: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400&q=80',
    },
    {
      name: '실크 스카프 선물세트',
      description: '100% 천연 실크 스카프, 웨딩·회갑 답례품으로 격조 있는 선택',
      price: 68000,
      originalPrice: 85000,
      stock: 50,
      category: ProductCategory.FASHION,
      imageUrl: 'https://images.unsplash.com/photo-1601924351433-2b50cb0da498?w=400&q=80',
    },
    {
      name: '가죽 카드지갑 선물세트',
      description: '소가죽 슬림 카드지갑, 각인 서비스 가능, 남녀 공용',
      price: 42000,
      originalPrice: 55000,
      stock: 110,
      category: ProductCategory.FASHION,
      imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80',
    },

    // BOOKS (2개)
    {
      name: '감사 메시지 팝업 카드 10종 세트',
      description: '손으로 만든 3D 팝업 감사 카드, 답례품 메시지 카드로 활용',
      price: 18000,
      originalPrice: 25000,
      stock: 300,
      category: ProductCategory.BOOKS,
      imageUrl: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=400&q=80',
    },
    {
      name: '포토북 제작 선물권 (20p)',
      description: '소중한 순간을 담은 고급 포토북 제작권, 돌·결혼 기념 답례품',
      price: 38000,
      stock: 200,
      category: ProductCategory.BOOKS,
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
    },
  ];

  for (const data of productsData) {
    const existing = await productRepo.findOne({ where: { name: data.name } });
    if (existing) {
      console.log(`상품 이미 존재: ${data.name}`);
      continue;
    }
    const product = productRepo.create(data);
    await productRepo.save(product);
    console.log(`상품 생성: ${data.name}`);
  }

  console.log('\n시드 완료!');
  console.log(
    '- 유저 3개 (admin@example.com / user1@example.com / user2@example.com)',
  );
  console.log('- 상품 25개 (답례품 테마)');

  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('시드 실패:', err);
  process.exit(1);
});
