import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/media-about-section.css";
import { getMediaVideo } from "../api/strapi";

// Lấy ID YouTube từ nhiều dạng link khác nhau
function getYoutubeId(url) {
  if (!url) return null;

  const regExp =
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

function getYoutubeThumbnail(url) {
  const id = getYoutubeId(url);
  return id
    ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
    : null;
}

export default function MediaAboutSection() {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [thumbUrl, setThumbUrl] = useState("");
  const [isPlaying, setIsPlaying] =
    useState(false);

  useEffect(() => {
    async function loadVideo() {
      try {
        const data = await getMediaVideo(); // { videoUrl }
        if (!data?.videoUrl) return;

        const id = getYoutubeId(data.videoUrl);
        const thumb = getYoutubeThumbnail(
          data.videoUrl,
        );

        setVideoUrl(data.videoUrl);
        setVideoId(id || "");
        setThumbUrl(thumb || "");
      } catch (err) {
        console.error(
          "Media video load error:",
          err,
        );
      }
    }

    loadVideo();
  }, []);

  const handlePlay = () => {
    if (!videoId) return;
    setIsPlaying(true);
  };

  return (
    <section className='gc-media-about'>
      <div className='gc-media-about-inner'>
        {/* LEFT: MEDIA */}
        <div className='gc-media-block'>
          <div className='gc-media-heading'>
            <h2 className='gc-media-title'>
              MEDIA
            </h2>
            <p className='gc-media-subtitle'>
              Các phương tiện truyền thông của
              thành phố
            </p>
          </div>

          <div className='gc-media-card'>
            <div className='gc-media-thumbnail'>
              {isPlaying && videoId ? (
                <div className='gc-media-video-wrapper'>
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                    title='Gacha City media video'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                    allowFullScreen
                  />
                </div>
              ) : (
                <>
                  {thumbUrl ? (
                    <img
                      src={thumbUrl}
                      alt='Gacha City media'
                      className='gc-media-thumb-img'
                      loading='lazy'
                    />
                  ) : (
                    <div className='gc-media-thumb-placeholder'>
                      Chưa có video
                    </div>
                  )}
                  <button
                    type='button'
                    className='gc-media-play-center'
                    onClick={handlePlay}
                    disabled={!videoId}
                  >
                    <div className='gc-media-play-circle-only'>
                      <span className='gc-media-play-icon-only'>
                        ▶
                      </span>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className='gc-about-block'>
          <h2 className='gc-about-title'>
            ABOUT GACHA CITY
          </h2>
          <p className='gc-about-desc'>
            Gacha City là một máy chủ RP
            (Roleplay) trong tựa game GTA V, nơi
            người chơi nhập vai vào nhiều nhân vật
            khác nhau để xây dựng câu chuyện, cuộc
            sống và mối quan hệ riêng trong một
            thành phố ảo sống động. Tại đây, bạn
            có thể trở thành cảnh sát, bác sĩ,
            doanh nhân, nghệ sĩ hay thậm chí là
            tội phạm, tuỳ vào cách bạn muốn viết
            nên hành trình của mình. Gacha City
            nổi bật với cộng đồng thân thiện, luật
            chơi chặt chẽ và hệ thống mô phỏng
            phong phú, mang lại trải nghiệm nhập
            vai vừa tự do vừa sâu sắc – mỗi lựa
            chọn của bạn đều tạo nên một câu
            chuyện đáng nhớ.
          </p>

          <div className='gc-about-actions'>
            <Link
              to='/faq'
              className='gc-about-btn gc-about-btn--secondary'
            >
              Hỏi đáp
            </Link>
            <Link
              to='/guide'
              className='gc-about-btn gc-about-btn--primary'
            >
              Hướng dẫn
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
