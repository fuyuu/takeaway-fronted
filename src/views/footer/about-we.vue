<template>
  <!-- 关于我们的声明 -->
  <!-- 头部区域 -->
  <header class="header">
    <div class="container header-content">
      <h1>关于外卖人</h1>
      <p>自2003年成立以来，我们始终致力于为用户提供最优质的外卖服务体验，连接美食与生活</p>
    </div>
  </header>

  <!-- 导航标签 -->
  <div class="nav-tabs">
    <div class="container" style="display: flex; justify-content: center;">
      <div class="nav-tab active" data-target="intro">公司介绍</div>
      <div class="nav-tab" data-target="history">发展历程</div>
      <div class="nav-tab" data-target="values">核心价值</div>
      <div class="nav-tab" data-target="team">团队介绍</div>
      <div class="nav-tab" data-target="contact">联系我们</div>
    </div>
  </div>

  <!-- 主要内容区域 -->
  <div class="container">
    <!-- 公司介绍 -->
    <section id="intro" class="content-section active">
      <h2 class="section-title">公司介绍</h2>
      <div class="intro-content">
        <div class="intro-text">
          <h3>连接美食与生活，创造美好体验</h3>
          <p>外卖人成立于2003年，是中国领先的本地生活服务平台。我们通过科技创新，为用户提供便捷高效的外卖配送服务，连接消费者与优质餐厅，让美食触手可及。</p>
          <p>我们的使命是"让生活更简单，让美食更便捷"。通过不断优化技术平台和服务流程，我们致力于为用户提供最优质的外卖体验，同时为餐饮商家创造更多商业机会。</p>
          <p>目前，我们的服务已覆盖全国200多个城市，与超过10万家优质餐厅建立合作关系，日订单量突破百万，成为千万用户信赖的外卖服务平台。</p>
        </div>
        <div class="intro-image">
          <div
            style="background: linear-gradient(135deg, #ff9966, #ff6633); height: 400px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem;">
            公司形象图片
          </div>
        </div>
      </div>
    </section>

    <!-- 发展历程 -->
    <section id="history" class="content-section">
      <h2 class="section-title">发展历程</h2>
      <div class="timeline">
        <div class="timeline-item">
          <div class="timeline-year">2003年</div>
          <div class="timeline-content">
            <h3>公司成立</h3>
            <p>外卖人正式成立，开始在北京提供外卖配送服务，最初仅覆盖朝阳区部分商圈。</p>
          </div>
        </div>
        <div class="timeline-item">
          <div class="timeline-year">2008年</div>
          <div class="timeline-content">
            <h3>业务拓展</h3>
            <p>服务范围扩展至北京全城，并开始在上海、广州等一线城市布局，平台合作餐厅突破1000家。</p>
          </div>
        </div>
        <div class="timeline-item">
          <div class="timeline-year">2013年</div>
          <div class="timeline-content">
            <h3>移动端上线</h3>
            <p>推出外卖人APP，实现移动端订餐，用户数量快速增长，日订单量突破10万单。</p>
          </div>
        </div>
        <div class="timeline-item">
          <div class="timeline-year">2018年</div>
          <div class="timeline-content">
            <h3>全面升级</h3>
            <p>平台全面升级，引入智能推荐算法，优化配送路径，服务覆盖全国100个城市。</p>
          </div>
        </div>
        <div class="timeline-item">
          <div class="timeline-year">2023年</div>
          <div class="timeline-content">
            <h3>新里程碑</h3>
            <p>日订单量突破百万，服务覆盖全国200多个城市，成为行业领先的本地生活服务平台。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 核心价值 -->
    <section id="values" class="content-section">
      <h2 class="section-title">核心价值</h2>
      <div class="values-grid">
        <div class="value-card">
          <div class="value-icon">
            <i class="fas fa-heart"></i>
          </div>
          <h3>用户至上</h3>
          <p>始终将用户需求放在首位，通过持续创新和优化，为用户提供最优质的服务体验。</p>
        </div>
        <div class="value-card">
          <div class="value-icon">
            <i class="fas fa-handshake"></i>
          </div>
          <h3>诚信经营</h3>
          <p>坚持诚信为本，与合作伙伴建立长期稳定的合作关系，共同创造价值。</p>
        </div>
        <div class="value-card">
          <div class="value-icon">
            <i class="fas fa-rocket"></i>
          </div>
          <h3>创新驱动</h3>
          <p>以技术创新为核心驱动力，不断提升服务效率和用户体验。</p>
        </div>
        <div class="value-card">
          <div class="value-icon">
            <i class="fas fa-users"></i>
          </div>
          <h3>团队协作</h3>
          <p>倡导开放包容的团队文化，鼓励跨部门协作，共同实现目标。</p>
        </div>
      </div>
    </section>

    <!-- 团队介绍 -->
    <section id="team" class="content-section">
      <h2 class="section-title">核心团队</h2>
      <div class="team-grid">
        <div class="team-member">
          <div class="member-photo">
            <i class="fas fa-user"></i>
          </div>
          <div class="member-info">
            <h3>张明</h3>
            <div class="position">创始人 & CEO</div>
            <p>拥有15年互联网行业经验，曾任职于多家知名科技公司，对外卖行业有深刻理解和丰富经验。</p>
          </div>
        </div>
        <div class="team-member">
          <div class="member-photo">
            <i class="fas fa-user"></i>
          </div>
          <div class="member-info">
            <h3>李华</h3>
            <div class="position">首席技术官</div>
            <p>负责公司技术战略和产品研发，在大数据、人工智能领域有深入研究，带领团队构建高效稳定的技术平台。</p>
          </div>
        </div>
        <div class="team-member">
          <div class="member-photo">
            <i class="fas fa-user"></i>
          </div>
          <div class="member-info">
            <h3>王芳</h3>
            <div class="position">运营总监</div>
            <p>负责平台日常运营和用户增长，擅长数据分析和精细化运营，推动业务持续高速增长。</p>
          </div>
        </div>
        <div class="team-member">
          <div class="member-photo">
            <i class="fas fa-user"></i>
          </div>
          <div class="member-info">
            <h3>赵强</h3>
            <div class="position">市场总监</div>
            <p>负责品牌建设和市场推广，拥有丰富的市场营销经验，成功打造多个知名品牌案例。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 联系我们 -->
    <section id="contact" class="content-section">
      <h2 class="section-title">联系我们</h2>
      <div class="contact-content">
        <div class="contact-info">
          <div class="contact-item">
            <div class="contact-icon">
              <i class="fas fa-map-marker-alt"></i>
            </div>
            <div class="contact-details">
              <h3>公司地址</h3>
              <p>北京市朝阳区科技园A座1001室</p>
            </div>
          </div>
          <div class="contact-item">
            <div class="contact-icon">
              <i class="fas fa-phone"></i>
            </div>
            <div class="contact-details">
              <h3>联系电话</h3>
              <p>400-123-4567</p>
            </div>
          </div>
          <div class="contact-item">
            <div class="contact-icon">
              <i class="fas fa-envelope"></i>
            </div>
            <div class="contact-details">
              <h3>电子邮箱</h3>
              <p>contact@example.com</p>
            </div>
          </div>
          <div class="contact-item">
            <div class="contact-icon">
              <i class="fas fa-clock"></i>
            </div>
            <div class="contact-details">
              <h3>工作时间</h3>
              <p>周一至周五 9:00-18:00</p>
            </div>
          </div>
        </div>
        <div class="map-placeholder">
          公司位置地图
        </div>
      </div>
    </section>
  </div>

  <!-- 页脚 -->
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>关于我们</h3>
          <p>我们是一家专注于提供优质服务的企业，致力于为用户创造更好的体验。自2003年成立以来，始终坚持诚信经营，不断提升服务质量。</p>
          <div class="social-links">
            <a href="#" class="social-icon" title="微信">
              <i class="fab fa-weixin"></i>
            </a>
            <a href="#" class="social-icon" title="微博">
              <i class="fab fa-weibo"></i>
            </a>
            <a href="#" class="social-icon" title="抖音">
              <i class="fab fa-tiktok"></i>
            </a>
          </div>
        </div>
        <div class="footer-section">
          <h3>快速链接</h3>
          <ul class="footer-links">
            <li><a href="#">商户诚信公约</a></li>
            <li><a href="#">规则中心</a></li>
            <li><a href="#">媒体报道</a></li>
            <li><a href="#">商户入驻</a></li>
            <li><a href="#">推广服务</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h3>联系我们</h3>
          <ul class="footer-links">
            <li><i class="fas fa-map-marker-alt"></i> 北京市朝阳区科技园A座1001室</li>
            <li><i class="fas fa-phone"></i> 400-123-4567</li>
            <li><i class="fas fa-envelope"></i> contact@example.com</li>
            <li><i class="fas fa-clock"></i> 工作时间: 9:00-18:00</li>
          </ul>
        </div>
        <div class="footer-section">
          <h3>应用下载</h3>
          <div
            style="background: white; width: 120px; height: 120px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px; border-radius: 5px;">
            二维码
          </div>
          <p>扫码下载APP</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>©2003-2023 外卖人. 保留所有权利 | 京ICP备12345678号</p>
        <div style="margin-top: 10px;">
          <a href="#" style="color: #adb5bd; text-decoration: none; margin: 0 10px;">隐私政策</a>
          <span>|</span>
          <a href="#" style="color: #adb5bd; text-decoration: none; margin: 0 10px;">用户协议</a>
          <span>|</span>
          <a href="#" style="color: #adb5bd; text-decoration: none; margin: 0 10px;">食品安全</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
// 可以在这里添加需要的逻辑，比如数据获取等
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

body {
  background-color: #f8f9fa;
  color: #333;
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 头部样式 */
.header {
  background: linear-gradient(135deg, #ff6633 0%, #ff9966 100%);
  color: white;
  padding: 80px 0 60px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.header::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23ffffff" fill-opacity="0.1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,202.7C672,203,768,181,864,181.3C960,181,1056,203,1152,202.7C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>');
  background-size: cover;
  background-position: center;
}

.header-content {
  position: relative;
  z-index: 1;
}

.header h1 {
  font-size: 3rem;
  margin-bottom: 20px;
  font-weight: 700;
}

.header p {
  font-size: 1.2rem;
  max-width: 700px;
  margin: 0 auto;
  opacity: 0.9;
}

/* 导航样式 */
.nav-tabs {
  display: flex;
  justify-content: center;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-tab {
  padding: 20px 30px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
}

.nav-tab.active {
  color: #ff6633;
  border-bottom: 3px solid #ff6633;
}

.nav-tab:hover {
  color: #ff6633;
}

/* 内容区域样式 */
.content-section {
  padding: 80px 0;
  display: none;
}

.content-section.active {
  display: block;
}

.section-title {
  text-align: center;
  font-size: 2.2rem;
  margin-bottom: 50px;
  color: #333;
  position: relative;
}

.section-title::after {
  content: "";
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: #ff6633;
  border-radius: 2px;
}

/* 公司介绍 */
.intro-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  align-items: center;
}

.intro-text h3 {
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #333;
}

.intro-text p {
  margin-bottom: 20px;
  color: #666;
}

.intro-image {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.intro-image img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.5s ease;
}

.intro-image:hover img {
  transform: scale(1.05);
}

/* 发展历程 */
.timeline {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #ff6633;
  transform: translateX(-50%);
}

.timeline-item {
  position: relative;
  margin-bottom: 50px;
  width: 50%;
  padding: 0 40px;
}

.timeline-item:nth-child(odd) {
  left: 0;
}

.timeline-item:nth-child(even) {
  left: 50%;
}

.timeline-content {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  position: relative;
}

.timeline-content::after {
  content: '';
  position: absolute;
  top: 20px;
  width: 20px;
  height: 20px;
  background: white;
  transform: rotate(45deg);
}

.timeline-item:nth-child(odd) .timeline-content::after {
  right: -10px;
}

.timeline-item:nth-child(even) .timeline-content::after {
  left: -10px;
}

.timeline-year {
  position: absolute;
  top: -15px;
  background: #ff6633;
  color: white;
  padding: 8px 20px;
  border-radius: 30px;
  font-weight: 600;
  box-shadow: 0 5px 15px rgba(255, 102, 51, 0.3);
}

.timeline-item:nth-child(odd) .timeline-year {
  right: 20px;
}

.timeline-item:nth-child(even) .timeline-year {
  left: 20px;
}

/* 核心价值 */
.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.value-card {
  background: white;
  border-radius: 10px;
  padding: 40px 30px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.value-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.value-icon {
  width: 80px;
  height: 80px;
  background: rgba(255, 102, 51, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 25px;
  color: #ff6633;
  font-size: 2rem;
}

.value-card h3 {
  margin-bottom: 15px;
  color: #333;
}

.value-card p {
  color: #666;
}

/* 团队介绍 */
.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.team-member {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.team-member:hover {
  transform: translateY(-10px);
}

.member-photo {
  height: 250px;
  background: linear-gradient(135deg, #ff9966, #ff6633);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 4rem;
}

.member-info {
  padding: 25px;
  text-align: center;
}

.member-info h3 {
  margin-bottom: 5px;
  color: #333;
}

.member-info .position {
  color: #ff6633;
  margin-bottom: 15px;
  font-weight: 500;
}

.member-info p {
  color: #666;
  font-size: 0.95rem;
}

/* 联系方式 */
.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
}

.contact-info {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.contact-item {
  display: flex;
  margin-bottom: 25px;
  align-items: flex-start;
}

.contact-icon {
  width: 50px;
  height: 50px;
  background: rgba(255, 102, 51, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff6633;
  font-size: 1.2rem;
  margin-right: 20px;
  flex-shrink: 0;
}

.contact-details h3 {
  margin-bottom: 5px;
  color: #333;
}

.contact-details p {
  color: #666;
}

.map-placeholder {
  background: linear-gradient(135deg, #ff9966, #ff6633);
  border-radius: 10px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header h1 {
    font-size: 2.2rem;
  }

  .nav-tabs {
    flex-wrap: wrap;
  }

  .nav-tab {
    padding: 15px 20px;
    font-size: 0.9rem;
  }

  .intro-content,
  .contact-content {
    grid-template-columns: 1fr;
  }

  .timeline::before {
    left: 30px;
  }

  .timeline-item {
    width: 100%;
    padding-left: 70px;
    padding-right: 0;
  }

  .timeline-item:nth-child(even) {
    left: 0;
  }

  .timeline-item:nth-child(odd) .timeline-content::after,
  .timeline-item:nth-child(even) .timeline-content::after {
    left: -10px;
    right: auto;
  }

  .timeline-item:nth-child(odd) .timeline-year,
  .timeline-item:nth-child(even) .timeline-year {
    left: 0;
    right: auto;
  }
}

/* 页脚样式 */
.footer {
  background: #343a40;
  color: #adb5bd;
  padding: 50px 0 20px;
  margin-top: 50px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.footer-section h3 {
  color: white;
  margin-bottom: 20px;
  font-size: 1.2rem;
}

.footer-links {
  list-style: none;
}

.footer-links li {
  margin-bottom: 10px;
}

.footer-links a {
  color: #adb5bd;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #ff6633;
}

.social-links {
  display: flex;
  gap: 15px;
}

.social-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #adb5bd;
  transition: all 0.3s ease;
}

.social-icon:hover {
  background: #ff6633;
  color: white;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 20px;
  text-align: center;
  font-size: 0.9rem;
}
</style>