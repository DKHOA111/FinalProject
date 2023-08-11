import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function ChapterNav({ chapter, relatedChapters }) {
  const navigate = useNavigate();

  function handleClick() {
    navigate(`/Manga/${chapter.manga.id}`);
  }

  const findChapter = (number, groupId) => {
    const foundChapters = relatedChapters.filter((c) => c.number === number);
    return (
      foundChapters.find((c) => c.groupId === chapter.groupId) ||
      foundChapters[0]
    );
  };
  const navigateToPrevChapter = () => {
    const prevNumber = chapter.number - 1;
    let prevChapter = findChapter(prevNumber);
    let confirmNavigate = true;

    // in case there is a gap between chapters
    if (!prevChapter) {
      const earlierChapters = relatedChapters.filter(
        (c) => c.number < prevNumber
      );
      prevChapter =
        earlierChapters.find((c) => c.groupId === chapter.groupId) ||
        earlierChapters[0];
      confirmNavigate = window.confirm(
        `There is a gap between chapters: ${chapter.number} -> ${prevChapter.number}. Do you want to jump anyway?`
      );
    }

    if (confirmNavigate) {
      navigateToChapter(prevChapter.id);
    }
  };
  const navigateToNextChapter = () => {
    const nextNumber = chapter.number + 1;
    let nextChapter = findChapter(nextNumber);
    let confirmNavigate = true;

    // in case there is a gap between chapters
    if (!nextChapter) {
      const earlierChapters = relatedChapters.filter(
        (c) => c.number > nextChapter
      );
      nextChapter =
        earlierChapters.findLast((c) => c.groupId === chapter.groupId) ||
        earlierChapters[earlierChapters.length - 1];
      confirmNavigate = window.confirm(
        `There is a gap between chapters: ${chapter.number} -> ${nextChapter.number}. Do you want to jump anyway?`
      );
    }

    if (confirmNavigate) {
      navigateToChapter(nextChapter.id);
    }
  };
  const navigateToChapter = (chapterId) => {
    navigate(`/Chapter/${chapterId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isPrevDisable = () => {
    if (!relatedChapters) return false;
    const firstChapterNumber =
      relatedChapters[relatedChapters.length - 1].number;
    return firstChapterNumber === chapter.number;
  };
  const isNextDisable = () => {
    if (!relatedChapters) return false;
    const lastChapterNumber = relatedChapters[0].number;
    return lastChapterNumber === chapter.number;
  };

  return (
    <div className="chapter-nav">
      <button className="circle-button" onClick={handleClick}>
        <i className="fa-solid fa-list-ul"></i>
      </button>
      <button
        className="circle-button"
        onClick={navigateToPrevChapter}
        disabled={isPrevDisable()}
      >
        <i className="fa-solid fa-arrow-left"></i>
      </button>
      <Dropdown drop="start">
        <Dropdown.Toggle>
          <button className="circle-button">{chapter.number}</button>
        </Dropdown.Toggle>
        <Dropdown.Menu className="chapter-dropdown">
          {relatedChapters &&
            relatedChapters.map((c) => (
              <span
                key={c.id}
                className="card-link dropdown-item"
                onClick={() => navigateToChapter(c.id)}
              >
                Chapter {c.number}
              </span>
            ))}
        </Dropdown.Menu>
      </Dropdown>
      <button
        className="circle-button"
        onClick={navigateToNextChapter}
        disabled={isNextDisable()}
      >
        <i className="fa-solid fa-arrow-right"></i>
      </button>
      <button className="circle-button">
        <i className="fa-regular fa-heart"></i>
      </button>
      <button className="circle-button">
        <i className="fa-regular fa-flag"></i>
      </button>
    </div>
  );
}
