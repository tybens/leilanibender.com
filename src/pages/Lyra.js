import React, { Component } from 'react';
import Gallery from 'react-photo-gallery';
import Lightbox from 'react-images';

class Lyra extends Component {
  constructor(props) {
    super(props);
    this.state = { currentImage: 0 };
    this.closeLightbox = this.closeLightbox.bind(this);
    this.openLightbox = this.openLightbox.bind(this);
    this.gotoNext = this.gotoNext.bind(this);
    this.gotoPrevious = this.gotoPrevious.bind(this);

  }

  componentDidMount () {
    document.title = "Lyra Dance";
  }

  openLightbox(event, obj) {
    this.setState({
      currentImage: obj.index,
      lightboxIsOpen: true,
    });
  }
  closeLightbox() {
    this.setState({
      currentImage: 0,
      lightboxIsOpen: false,
    });
  }
  gotoPrevious() {
    this.setState({
      currentImage: this.state.currentImage - 1,
    });
  }
  gotoNext() {
    this.setState({
      currentImage: this.state.currentImage + 1,
    });
  }

  render() {
    const doubleKneeHang = {
      src: "https://lh3.googleusercontent.com/adcY03AiwS3UhmL5AQGnDOWtBRbLcDdD5PCzyXOeoYTJdpM6Bor0N7q2a5J0sgZXLO4TUkEJsqRgSJZyQT4S49B-g9JGrTsy5Nw3fM0vw_1dsVN_Ue0pCFqF9hVTKrAN-QJc83CPQKesyUK338VQR30AgkQMZheK1HRc_-xPsfy_GyvtWNzOUJhuaL-P9uXqsKGZxYphPahid4EI_0W5JNyISxdzVRmQ89i1Y68U8VtijxrXuni6EEVkxEIUmblP6d3agHTl9vEOtZni67CWFpPOtI5plHBkcOfYPkkcSlOLp6VdfbLwWqirkT8T77BhcU5c4VvSWCXk-x9XB5KDUyq_EZmrdyqT_FkVeVwjBP7me_lvYSEqZLahky3SYkhKY-fbb11qtlVxY9haeQ8hyYd2rG8xRZfL2HHQpsB8YR5XIY5_7fXx0NHidJbHXRMT0P4pE6CvTb95lSeksuT44Pklmy-KqLd15M9p-LUwSBj5Tjqczs0QHu1ojgRKKmxFbzTpUM9WraeQEZ0OExkW6005q2Lm9IamFB2PxmlyGqHWjqPKv6FysV8Y-w0sd5JUJDIy2fV7fCa2QyQLSIeziPRDfk-QChq-ftlklwPiBJBdnR_fCHn0D-6WKj54i6NYZ5nCwA_GhlPVekGc6FLJSiKO6w=w1094-h1942-no", 
      width: 2,
      height: 2
    }
    const highArabesque = {
      src: "https://lh3.googleusercontent.com/eK2DI1vYRJbUe6eVXbLw42v5fIO2xZ-PkInamwTWOsVQAP0TCr0sBvnOR_xtPcIGkp_m5-Vz2LGa0SN_ETBBcps-uoHmdJsTLG03D88B5qgB1sLYkPOY7qSFbTSmxN43KbLpVGXurym8oJyXIlzX5y_hrk_m5xYsE4zKEZynCp1Ch8saHKH3tzpSEMj6Yx0SbfAcIoqPUeePF9C4lKKuuvon5fAHQexuCAscZHthBJDGRK_iBff4JKp1qGMJlpDL93TTnmRNjJKYgoz2kB6QTH61UMhpLVyXoAtrkXOr7SkZ1CH2RB065199lc_pEp8uR7arV2x3uw7AmoNvwLmgqvWXQw4eGF4HWpnasfaf7Sp6Yc2ozYt0CjPh86BEEjS66w49LjvVgp5GhXlQdT00-mU1mZO8DCRVtUb3wzyfTz5ejnkzjIt3Qok1q8LFX-RTGvywKWvs6nIL35rN9DcJ8sp3RphiysSVEQoImKxNCxwQRfivTHmD0cUoY5MK6Val6-XhP0QeLGhcUJCwdbk7ReBgqpeaKwPa3XR2kHdt8Iu-3KfSHhCekYWTRM2GZaAZZ8bbarZiHPkVWE4FjdrutWkbnmEM25ciZWY0KDuCrPV_yqFB4ECVli2UyGsDok0BRqcvZLsG8VzwzgJsJSH2mhp0IwLMpQc6dV4vHhX-a13xcjQS7JVrxXy2l2QON884K04VzBIZJUiwmQfBd1w=w1064-h1024-no",
      width: 2, 
      height: 2
    }
    const birdsNest = {
      src: "https://lh3.googleusercontent.com/kdvvz0hV47A0S7sqPhcMJ04mviqWsRmqS2Wv3VjyLYtIB49dcZMmKlrZmf-UD0LJSvgsHjkbNCFoU2Fm1a-v_318GJ2KK8zziRe29suC3DkyBV-PzEwEOR8ALDmgmwKF7e1dx1JkeT54WoKRoluS6gcRSpybaNEfWPbs7RjcMBp1PTO9Y8dVKEl2V_87S_1NZjAG5H_bMF0--90VBJlRo_bi92n1J5eMRu3HPEiGVCBAyOpwHimr_kgXHGAe6AyKMSPjEixQFEW9F1QuHOyCsoDhQlXQwubvxRTMuFntnm7ebL3kUiKd4zlHk5E_rkXYUp2sxX47QlcyyP1WRlTO2L5xLaurSjF-IzCeix1doYbyKybijCPuZrKx8ja6PWCfoJjqJbf3ggqJYl-D30cZFQ2NYKPFXViReCoR-3mgT2eTlks4AkiyR7l0JVELz73eZyS6oB9xsuPfy39oY6_N4w35Ss6CA7vbWLOf5aUu4Z3JcLjQvtWW5t2GO5yJbCyWFHfPeOyZGmHTD6gfk3DemkZs69NSvyNGofY0N4dTPwjoL2EYaejq0A-1sZBlB7siWXeVP0claEudE3sozgnABuoFWrN79pOJmVXJvVK6zSfCqv3xZGhAYeUft24DuOD8iOwrL90hCH4WxMuWjMGi_Mnp0w=w281-h347-no",      width: 2, 
      width: 2,
      height: 2
    }
    const openDelilah = {
      src: "https://lh3.googleusercontent.com/CSe6c7PcOcZAxRLMuo5a1kCZz0VvBaQxFpR_0XuB-487aaxF-gts76GKAVHXv5ifySvcQN7Y4dQw4qLMKZcWA2odHWH0tu6DhW94dmfiGH4F4pgcx4nYd9XaPHSXUBCawnR0Z8-CHHuxjfKjz61i90Rt78RbgfliL9Y3s-RWzJ8Kdka_IX-qS7Wj1BTt4kVe1hwCqN1OK9P-0inoNgfPQ2W-Fbo7E8IH26e3Si8fqjjFAfh1sBZlKnuIupsFA0u72hSKnKnx1u7VX7Xk1R8--b-XuyJLQKXzuQZylS2kK72wQDyUEnMBhsIiweOZ9VFZF7bvez14iyOgOAw0F1fB6988-JtOqDGB4MnX6HWFcJMkJxmeA2OsksOE4x368cdkeG1ZGyMSlmg0isFReZGvbPAOGLiR3_7e47rEfW2bp3qyPZa6HKrZvH8mKGxfxAOIUSgbXUBGGhlbTKGakHckcj5D6HNfE9a6LiCoXqNdckcgSWw88sCwcZKUJNwkhiYh1vZTGWDbYsSDefHm4KxuA_cKFG86ih_xOFYEm97NqyCNqNYph0CWaNQ7l3E9zMVQw_DcJ1y7hIaK7BmDxzEj_vheIA70ihXHtI5WbGmT0iYe-pHiVRwzG7VqUx4p0rz9f34cs8x4Kf4BRfgA-jzX1hhT6Q=w345-h337-no",      width: 2, 
      width: 2,
      height: 2
    }
    const manInTheMoon = {
      src: "https://lh3.googleusercontent.com/7VR7ltLidstaT7tZYmQXAtYrnccRDhgicQEKcv9s5yI-350ryintRnCs38BnbrOijFsIJRCk000rftrRCInyQb-YEHSn5kJZPofoQrfbRFe_5_TMJbTuHr8pEFdl4_lrVtpnnT-KFhxC64Wnw5ASxnMyi3BcbEd0LU36JQAx2O8VCMaC4R__cvyF4WfTX8LTu7BRF0fcSKz0ZaWdPv6rttsuROmXx5iGB-uAnv7UYe2z9xtb4CwXR9O7pHWFHnXoUXqb_dpUQUDpLAZ2LJRkgsHv7Vyj_nZ76R5CRZQh1wwML_dMJs-LpF3Of2TjtD2UkkdeS8jqpscWSu1eAXhsWIg4uBP6piLQ3eMV2xp61LBj5wLBpacinI_A4SKSkFak4i5IpJOMb7c3POXaJSLbYYaAglUh7usu9FihaDQqicaUUlwySyrYust8gnLosDdgE1opltKlCG1BhAt-o6WtlMRWyZrMYKTah7NKdrHHc2qFTkiTlONbH6LLQJWPUknwJA9HosDeEfb-JrvuRMPwQDqgEh5bM0INB3NeiCs8eIPKgxyHzVNwt6jrB7jsnfzXm4A3ay1HRVaNH6yOC1scTyUhx-cetyZChNVujRgGXqmz1HhRwa9UgwSpmbB6qfEcCg9eTZtdUcxyNH4UiM5iv59sWd8f9Fg7m8iZ8MJGCRQOtMGMy_HC1lihhPRXaI6UfdCCVi9CqsbQoljwulE=w384-h490-no",
      width: 2, 
      height: 2
    }
    const crescentMoon = {
      src: "https://lh3.googleusercontent.com/SOvSCNN5snLFEoI6Bhiniafawob6jggLb2jCdvgtOTBYOpvo4rbWJsToYXnMYbGR7G9ePc3O6AGuM7RPt6ZwvxVcL_MpeF8JzdNradz6mYy75TpGrVgGkrxzCI8aV054TfAgGGs2Oo3-kHkoEPLem-vmTV052RpxcZJvdIXGrBryd5z2bMiuVV6Ay4ZpYZaw1Em9ReUpir1MNIFMSa9Lzge2sfOyowC1Trhx6ts71vioorSgx7myPvRnQNHude4EoL79EGN2oWkKoEP9-Tr8u1N-TtAjpDgDsjem20psvWmDMue3D-8NLMpmvnq0Rat12ihhCCRC2ac2wMNOmrPBMVq0900XbC0G4oGMVNAosAy9xJPafuxeMMMGGvqxSD-J8BsJ8O8i4jZfBsFNtXgS5bsqGG_DVEDQZcq97fuc1hvmFUmrgrtFF5VLTjougeJO5POrQI4Ix77gSxSCOjWOfLbYOdjzX_UWg5epq78RCb80QUftGbMYWfTnlzSsurlNmUpOZ4FyBJY9j1E3nQGR--7T57SJkB4eVrGunzTQsznLhskg98nLU6cEqW86CHutiz1aJfEksw9Jrh0uQMoKIb04taChIO9yeqXJ2DVz9kDRxriw8EwyAFYZC1A9iRaeaf6FEaMd8l2N4ZtbgGOlPBnCHg=w398-h550-no",
      width: 2, 
      height: 2
    }

    const delilah = {
      src: "https://lh3.googleusercontent.com/pKYNiQwkFsOZ6GNtbzQUTS_iNoz9VN8InZPGPXpEP_6jjSeWDIQoDyBnXGmm9LTvdwan9TGcRVbPdGz9DkrW_bxw7kvzISRqgd9ZHVaQIr1ESCf7GMK1zbAasKzYYx8XdwAaOWiBIzUc3Hs2DWfGyrGCaXBP821iscTVLHxCP2xkNz4WwSesucksqzsm4ieueTNqMbl-8Ml5YEVbu5hoiOzEPKQMceofAOrg_TVdFCrYhKKryEe0amBL-sRgf5p2j4nxfqy-8hPKFOeOnnDoaIrkSllGwqbA2S-12QHPy72oG_GWVAGuUJkKG94EGoBHGmmujBzyWtKKklTFiuUjDwel1SblD5hjEjP4TSi7yaz4O3jrClWt0LMlX4z3Rs3xwuzFE6_4a9J6ZgfEz3JudIqS8thDOIfOzPedA99CoHfKwvTXfdjfUDlutQJUGwsifGkhdC_X6srzKDDV6ber-XhN20DI4Hnb8YKfmw9ML0i_gPUHaq3k9j7_gdw4P9Q8509fRHszC_MtFARCbcAY5TsSSHxa8dcDf858iWPhffYYVyba0Nsco-VGnnQipP581HtkDiAECpU5xkk2ALA800uIl-PMDAku253CeG6Cir1gA01E6hcQqRBKBzU44hpmt1DO6TRcJ8RXQYyvkZ2e6PSoTg=w822-h1210-no",
      width: 2, 
      height: 2
    }

    const elbow = {
      src: "https://lh3.googleusercontent.com/XcJ-Wxk-ugjqNYMWvnOzWIcPsxw1ED3a6XgrK_m0-YOcNPWhYqT3lsxlBSldXwrLudcloKHOLklDkTMw4Wa0RHR8-0w98x0kJhiuYA82WZ1i6GAgSKDiPtE6gM6PHe9cpDjhfx_WyWqjfgnmskZz98uZ9_ETt4wuVqRxEFQTHzrVBdqAt8XWGEOhDKn5kPQaEkFPv8P3Rc76d7aoobuZr9LXWH2xL7McTOBnYxNeKkz0vawouybGHpX41RW5Qnfodrk-igMv-MQ7Y-xgtbb3QCuLQ9i3A5ru78rYY-eQi2TSVo86etJc5cggF_WyXlUaO03DUZzIItps9rTttDGlFwJAIqYnbT5nLKicRz9PLMQjVcpHuNZj0ortfgkxaPT4XnCK_nInTg4xHmJEkEWpwTxmDpt99FlSaF7WSzeSoWfPJDkP5tmDpD5fi_scp0Vs5JXfeQYuLAmmPRIVV6cXqMdfxWRTdh8Xmcv73rUIP-ASZS17Dy7nJh3gl_qJ1QzRfTPsnUbfm1XaG_66zEBLIm7BoQUC5Rss_uy9uVEUtRQTyNZVswEOnSD7zMWDYW_PROo15aNrpmCpP2VYrvp7xtdxuLyv2Cb1p-FDzDI0KFGETVR-uduwP4ZK_lp9O83nf7Bok_6SrTjrauRdv5whOmF-DtgUMCZ1IwtHIt7_AiVYK8__-VbvuPnGwH912R6YlI0m4UcblMBl8pV-1Is=w396-h486-no", 
      width: 2, 
      height: 2
    }

    const photos = [
      elbow,
      doubleKneeHang,
      openDelilah,
      highArabesque,
      birdsNest,
      crescentMoon,
      delilah,
      manInTheMoon,
    ];
    return (
      <div className="Lyra">
        <main> 

          <h2 className="section-heading">Lyra / Aerial Hoop</h2>
          <Gallery photos={photos} onClick={this.openLightbox} direction="column"/>
          <Lightbox images={photos}
            onClose={this.closeLightbox}
            onClickPrev={this.gotoPrevious}
            onClickNext={this.gotoNext}
            currentImage={this.state.currentImage}
            isOpen={this.state.lightboxIsOpen}
          />
        </main>
      </div>
    );
  }
}

export default Lyra;
