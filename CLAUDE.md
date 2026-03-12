## 언어

- 한국어로 답변  


## 기술 스택

- NestJS + TypeScript
- TypeORM + MySQL
- Swagger  


## 폴더 구조

src/  
 common/ # 공통 guard, filter, pipe, interceptor  
 features/  
 [feature]/  
 dto/  
 entities/  
 _.controller.ts  
 _.service.ts  
 \*.module.ts

## 규칙

- Controller: HTTP 처리만
- Service: 비즈니스 로직
- 응답 형식: { data, message } / { message, status, code }
- console.log 금지
- any 타입 금지
