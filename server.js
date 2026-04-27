const express = require('express');
const { chromium } = require('playwright-core');

const app = express();
const PORT = process.env.PORT || 10000;

let browser, page;

// THAY THẾ BẰNG COOKIE TIKTOK CỦA BẠN
const COOKIE_STRING = "msToken=hGSAKJhdERKQP_c7yjjZ1rtFHHA70C8V93VPVqWKhLyt9oR4JynLCxfkk2T_ECWhQ9yavTExcTUj621cGCvvwix5Ly_wib5kvXS9Mzgi8TCEYfix2wZ4ztQZbjtEkruSymcoEuDaaXLMMD2kS-CAVUp74jDI; msToken=CUF1c_ULi-ab_sZZkdPUMh-e7sV8hUYk5m7Lwhsf3N7K_zGQHe2Na0dAC9RmsUimw_wh2EHQiisXAb46SeWcJqrX2_5p1f4SyUWTPNbzEjYCW7WH7CdS1HdOB2PCY9bZLPmEuuSZuxmda95iyn3p6vHkT9r3; odin_tt=432fbfb271a8abbbc849a731d156bdedb8399834d30125361b4ec2af11586c9e1a5af44756fefe7a2005246f862294b9628ef03e256de2a9f9aecdb1c8168a602cf3802a04e95dbb3a1755a0262cc871; store-country-code=vn; store-country-code-src=uid; store-country-sign=MEIEDK5FT_3mb96mZdb2ogQgzTs-Qd3R4k7rwKmeoKnYuYAKUs5TRgMHEWk7Uj8VRi0EEKfZNBfSSCzyqbQVr6fRGQA; store-idc=alisg; tt-target-idc=alisg; ttwid=1%7CbuURleiBwV5cvMmPDB0ZVwGiq-qkaaAijWP1wsxm2hU%7C1777271028%7C0fb3f2d5f3189a82444e3c1c740167ecaae723cc8f65ec9a6427149f56137c6b; tt_chain_token=YRMmj640ky80ZrKMKVu/hA==; tiktok_webapp_theme=dark; tiktok_webapp_theme_source=auto; tt-target-idc-sign=fT5KdIDNZRcat_PtdjDNKgLyJDzpTRL5jmyU4slGsQ5mOHVvgQ5W09cj8gu668MZly-40Ln7APs7O6ir_gEKBEThToO1N4z7tY3M-0lIBMEFxs2O7tpUUYZ3lp-a3QGKJ-TlVcVlvgHcjdG89J1cRcYimrRqCEpD2e7X3emJUmj6msE7CsOvXllhMhjFX-p1s6G_vYh_pSRFvY15nR7Bb4qZVrZl1x_shMSshUyMBzEktBvGRzljeYvsm3rEKRyXFLk6R6Xva2QmaFqkU6r5bbs2NEyF7TLylmvsys6E7pU0wrN0BVQdIT5pa1-dclZhML35uGEDuxoe1ZOWGVbjavA2BVk7YiqSsqqzEvI2tD0W2SnxhmOgml9DiTXG5FSz_-WU4WZUhHmMHngoSmI6rsaO-kJ0BgnAGkjEJ1iCvyYHvPYxZ0rMQs9zKHLTY9UU-Lz8LeXyoTPDPNaj_QY87kyhtmDkdT_V0jpQxP-RFDwvBIjGylvc2-tddiCFVMzU; cmpl_token=AgQYAPOF_hfkTtK17az787JdOPOAeEiJyf-KDmCgY0s; d_ticket=70d55539cd5d72402d8ca7dd3a82087b5d2ee; multi_sids=7337281182893114369%3Ab7df959f43dd79fe5b39bc3caf2a922f; sessionid=b7df959f43dd79fe5b39bc3caf2a922f; sessionid_ss=b7df959f43dd79fe5b39bc3caf2a922f; sid_guard=b7df959f43dd79fe5b39bc3caf2a922f%7C1777271020%7C15552000%7CSat%2C+24-Oct-2026+06%3A23%3A40+GMT; sid_tt=b7df959f43dd79fe5b39bc3caf2a922f; sid_ucp_v1=1.0.1-KGFlMzJlNGY5ZTBiZDgzNmNjMGNmYzEwNWRhZmFkZjQ1ZWZlODQwOGMKIgiBiILcx8vQ6WUQ7IG8zwYYswsgDDD2hM2uBjgEQOoHSAQQAxoCbXkiIGI3ZGY5NTlmNDNkZDc5ZmU1YjM5YmMzY2FmMmE5MjJmMk4KIAfnrQZSB9aG3qzQOr_jDRzZg0Vbw9Mes0RerS3BMTWEEiCDn0mm2pbZJQ7aT6VJoE37sCKdRuIqRqPpcEiBzhWgWRgBIgZ0aWt0b2s; ssid_ucp_v1=1.0.1-KGFlMzJlNGY5ZTBiZDgzNmNjMGNmYzEwNWRhZmFkZjQ1ZWZlODQwOGMKIgiBiILcx8vQ6WUQ7IG8zwYYswsgDDD2hM2uBjgEQOoHSAQQAxoCbXkiIGI3ZGY5NTlmNDNkZDc5ZmU1YjM5YmMzY2FmMmE5MjJmMk4KIAfnrQZSB9aG3qzQOr_jDRzZg0Vbw9Mes0RerS3BMTWEEiCDn0mm2pbZJQ7aT6VJoE37sCKdRuIqRqPpcEiBzhWgWRgBIgZ0aWt0b2s; tt_session_tlb_tag=sttt%7C4%7Ct9-Vn0Pdef5bObw8ryqSL_________-vCILk0KYdXt2R52UYQGJJc4LvHfWDF--fNf9Bz7Nke0w%3D; uid_tt=9d058d7701abdb7257df18d313a43bcdadd709bce3b4d7c446dabce9d2a3d0d1; uid_tt_ss=9d058d7701abdb7257df18d313a43bcdadd709bce3b4d7c446dabce9d2a3d0d1; last_login_method=passkey; _waftokenid=eyJ2Ijp7ImEiOiJ2VXl3dmhJaEhwUkFQZk9FdldBUHpJeUZrR2ZBUWM1VjhJT1llcENmUmJzPSIsImIiOjE3NzcyNzA5NjUsImMiOiJIOElIMnVWRGJGZCtuWWhxZlMvZWhaWkJOd0VxczNLNEZGV0VEMG5TNkw4PSJ9LCJzIjoiMFZpMVRpalVaRFVmRFF4NmpQVllBYlVjWnlmWmFGK0pNd2pBbldqZHduND0ifQ; csrf_session_id=36461c4d25bed70ed2524dd6677860f9; s_v_web_id=verify_mogt7x94_GegqgUvs_GamS_4Og3_9dYZ_oA0bClPPWr5i; passport_fe_beating_status=true; perf_feed_cache={%22expireTimestamp%22:1777874400000%2C%22itemIds%22:[%227633254710207597842%22%2C%227633230667224026389%22%2C%227614781156277488904%22]}; tt_csrf_token=IZ0RDMK2-yTRdsKxrnx5Xb9QBvaJA4BjjpT4; tt_ticket_guard_has_set_public_key=1; passport_auth_status=20829ca6cd3e3ce7935ae08b8017af73%2C70f4bc2bf1570dd1b61b4431770f6e76; passport_auth_status_ss=20829ca6cd3e3ce7935ae08b8017af73%2C70f4bc2bf1570dd1b61b4431770f6e76; fbm_1862952583919182=base_domain=.www.tiktok.com; fbsr_1862952583919182=TjKA3uqJ719IUv3I58B9u-KCwJfpO1za-q9TvQSldT0.eyJ1c2VyX2lkIjoiMTIyMTEwMTQ4NjEzMTk4MDEzIiwiY29kZSI6IkFRQ2VsNDltYXBuNnVqXzdBSllvaVNia1k0Q2g5TS14S3lZYjVubktQc2NzMzlySjRVR21ORkNLX1dJU05wRDd5dkdGeHRnWVRxRGhXVzZwNjNuWFA5U09UX2lubXVBNnFWaV8yN1NLVHJrM0JaODF0NHRPMFZrVWJFa2pGUDc1VzMtZjZKU2RFYVFaX01lS0lTZjNkNC1fUmFCWkhCZ1NFOHZuOXpRWjVpdHdlYk0wd3VHd3JRUHpNU2llY0EzMDE5SnluWG5Dank1QXVhTjZSenFjSnl0bWpVM2FsTjlkemtsSF9oS2R5OXRsOFNpZHBlb0VmMXJCUU1nUFpkMjVYNTB3VnozV2hfcVc0SmtSTl9UMEdJRFJCeFNsei1ReDR5YUcxZlpudGpFODZYdEhoR3J5X0MyRm5PczlGSkVmd1NzWVVLV1VDWm95ajhiblRNd1o2VkEtTnoyUWwzaHFaUjk3VzJGZ2lGdVk0ZyIsImFsZ29yaXRobSI6IkhNQUMtU0hBMjU2IiwiaXNzdWVkX2F0IjoxNzc2NTEzMTYxfQ; living_user_id=3984089934; delay_guest_mode_vid=3";

async function initBrowser() {
    console.log('Đang khởi động trình duyệt...');
    browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15'
    });
    page = await context.newPage();
    const cookies = COOKIE_STRING.split(';').map(c => {
        const [name, ...val] = c.trim().split('=');
        return { name: name.trim(), value: val.join('='), domain: '.tiktok.com' };
    }).filter(c => c.name);
    await context.addCookies(cookies);
    await page.goto('https://www.tiktok.com/foryou', { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log('Trình duyệt đã sẵn sàng!');
}

app.get('/sign', async (req, res) => {
    try {
        const params = req.query.params;
        if (!params) return res.status(400).json({ error: 'Thiếu params' });
        const xbogus = await page.evaluate((p) => {
            if (typeof window.sign !== 'function') {
                throw new Error('Không tìm thấy hàm sign()');
            }
            return window.sign(p);
        }, params);
        console.log(`Tạo X-Bogus thành công: ${xbogus.substring(0, 20)}...`);
        res.json({ xbogus });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(PORT, async () => {
    await initBrowser();
    console.log(`Server chạy tại cổng ${PORT}`);
});
