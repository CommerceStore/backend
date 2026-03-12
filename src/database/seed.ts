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
    // ELECTRONICS (5개)
    {
      name: '애플 맥북 프로 14인치',
      description: 'M3 Pro 칩, 18GB RAM, 512GB SSD',
      price: 2490000,
      originalPrice: 2990000,
      stock: 20,
      category: ProductCategory.ELECTRONICS,
    },
    {
      name: '삼성 갤럭시 S25 울트라',
      description: '6.8인치 AMOLED, 200MP 카메라',
      price: 1350000,
      originalPrice: 1550000,
      stock: 50,
      category: ProductCategory.ELECTRONICS,
    },
    {
      name: 'LG 올레드 TV 55인치',
      description: '4K OLED, 120Hz 주사율',
      price: 1200000,
      originalPrice: 1500000,
      stock: 15,
      category: ProductCategory.ELECTRONICS,
    },
    {
      name: '소니 WH-1000XM5 헤드폰',
      description: '업계 최고 노이즈 캔슬링',
      price: 380000,
      originalPrice: 450000,
      stock: 30,
      category: ProductCategory.ELECTRONICS,
    },
    {
      name: '애플 아이패드 프로 11인치',
      description: 'M4 칩, Liquid Retina 디스플레이',
      price: 1290000,
      stock: 25,
      category: ProductCategory.ELECTRONICS,
    },

    // FASHION (5개)
    {
      name: '나이키 에어맥스 270',
      description: '편안한 쿠셔닝의 라이프스타일 슈즈',
      price: 159000,
      originalPrice: 189000,
      stock: 100,
      category: ProductCategory.FASHION,
    },
    {
      name: '유니클로 울 블렌드 코트',
      description: '보온성과 스타일을 겸비한 겨울 코트',
      price: 199000,
      originalPrice: 249000,
      stock: 40,
      category: ProductCategory.FASHION,
    },
    {
      name: '리바이스 501 오리지널 청바지',
      description: '클래식 스트레이트 핏 데님',
      price: 89000,
      stock: 80,
      category: ProductCategory.FASHION,
    },
    {
      name: '폴로 랄프로렌 피케 셔츠',
      description: '아이코닉 폴로 셔츠',
      price: 129000,
      originalPrice: 159000,
      stock: 60,
      category: ProductCategory.FASHION,
    },
    {
      name: '구찌 GG 캔버스 토트백',
      description: '시그니처 GG 패턴 토트백',
      price: 1200000,
      stock: 10,
      category: ProductCategory.FASHION,
    },

    // BEAUTY (4개)
    {
      name: '설화수 자음생 크림',
      description: '탄력 있는 피부를 위한 안티에이징 크림',
      price: 180000,
      originalPrice: 210000,
      stock: 45,
      category: ProductCategory.BEAUTY,
    },
    {
      name: '에스티로더 갈색병 에센스',
      description: '피부 재생 세럼',
      price: 125000,
      stock: 35,
      category: ProductCategory.BEAUTY,
    },
    {
      name: '맥 루비우 립스틱',
      description: '오래 지속되는 매트 립스틱',
      price: 38000,
      originalPrice: 42000,
      stock: 70,
      category: ProductCategory.BEAUTY,
    },
    {
      name: 'SK-II 페이셜 트리트먼트 에센스',
      description: '피테라 성분의 토너 에센스',
      price: 170000,
      stock: 30,
      category: ProductCategory.BEAUTY,
    },

    // FOOD (4개)
    {
      name: '스타벅스 홈 블렌드 원두 450g',
      description: '부드럽고 균형 잡힌 미디엄 로스트',
      price: 22000,
      originalPrice: 26000,
      stock: 100,
      category: ProductCategory.FOOD,
    },
    {
      name: '제주 감귤 10kg',
      description: '햇감귤 산지 직송',
      price: 35000,
      stock: 50,
      category: ProductCategory.FOOD,
    },
    {
      name: '한우 1++ 등심 500g',
      description: '프리미엄 한우 냉장 등심',
      price: 89000,
      originalPrice: 110000,
      stock: 20,
      category: ProductCategory.FOOD,
    },
    {
      name: '신라면 멀티팩 (40봉)',
      description: '매콤한 국물의 베스트셀러 라면',
      price: 18500,
      stock: 200,
      category: ProductCategory.FOOD,
    },

    // SPORTS (4개)
    {
      name: '요넥스 나노플레어 800 배드민턴 라켓',
      description: '공격형 프레임의 경량 라켓',
      price: 189000,
      originalPrice: 230000,
      stock: 25,
      category: ProductCategory.SPORTS,
    },
    {
      name: '무타마 피트니스 요가 매트 6mm',
      description: '미끄럼 방지 TPE 소재 요가 매트',
      price: 45000,
      stock: 60,
      category: ProductCategory.SPORTS,
    },
    {
      name: '나이키 줌 페가수스 41',
      description: '데일리 러닝화의 정석',
      price: 149000,
      originalPrice: 179000,
      stock: 45,
      category: ProductCategory.SPORTS,
    },
    {
      name: '아디다스 테크핏 타이츠',
      description: '압박감과 통기성을 갖춘 스포츠 타이츠',
      price: 69000,
      stock: 55,
      category: ProductCategory.SPORTS,
    },

    // HOME (4개)
    {
      name: '다이슨 V15 디텍트 무선 청소기',
      description: '레이저 먼지 감지 기술 탑재',
      price: 999000,
      originalPrice: 1100000,
      stock: 15,
      category: ProductCategory.HOME,
    },
    {
      name: '코멧 에어프라이어 6L',
      description: '대용량 디지털 에어프라이어',
      price: 89000,
      originalPrice: 119000,
      stock: 40,
      category: ProductCategory.HOME,
    },
    {
      name: '무인양품 소파 2인용',
      description: '심플한 디자인의 패브릭 소파',
      price: 450000,
      stock: 8,
      category: ProductCategory.HOME,
    },
    {
      name: '필립스 히어 커피머신',
      description: '자동 에스프레소 머신',
      price: 350000,
      originalPrice: 420000,
      stock: 20,
      category: ProductCategory.HOME,
    },

    // BOOKS (3개)
    {
      name: '클린 코드 (Clean Code)',
      description: '애자일 소프트웨어 장인 정신',
      price: 33000,
      originalPrice: 38000,
      stock: 80,
      category: ProductCategory.BOOKS,
    },
    {
      name: '토비의 스프링 3.1',
      description: '스프링 심층 이해를 위한 바이블',
      price: 55000,
      stock: 40,
      category: ProductCategory.BOOKS,
    },
    {
      name: '이펙티브 자바 3판',
      description: '자바 프로그래밍 언어 모범 사례',
      price: 36000,
      stock: 50,
      category: ProductCategory.BOOKS,
    },

    // KIDS (3개)
    {
      name: '레고 테크닉 포드 GT',
      description: '테크닉 시리즈 고급 블록 세트',
      price: 129000,
      originalPrice: 159000,
      stock: 30,
      category: ProductCategory.KIDS,
    },
    {
      name: '닌텐도 스위치 마리오 카트 8',
      description: '전 연령이 즐기는 레이싱 게임',
      price: 59000,
      stock: 60,
      category: ProductCategory.KIDS,
    },
    {
      name: '피셔프라이스 유아 학습 테이블',
      description: '소리와 빛으로 배우는 유아 장난감',
      price: 49000,
      originalPrice: 65000,
      stock: 35,
      category: ProductCategory.KIDS,
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
  console.log('- 상품 28개');

  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('시드 실패:', err);
  process.exit(1);
});
