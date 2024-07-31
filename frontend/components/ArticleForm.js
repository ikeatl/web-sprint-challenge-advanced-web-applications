import React, { useEffect, useState } from "react";
import PT from "prop-types";

const initialFormValues = { title: "", text: "", topic: "" };

export default function ArticleForm(props) {
  const [values, setValues] = useState(initialFormValues);
  // ✨ where are my props? Destructure them here
  const { postArticle, updateArticle, setCurrentArticleId, currentArticle } = props;

  useEffect(() => {
    // ✨ implement
    // Every time the `currentArticle` prop changes, we should check it for truthiness:
    // if it's truthy, we should set its title, text and topic into the corresponding
    // values of the form. If it's not, we should reset the form back to initial values.
    if (currentArticle) {
      setValues({
        title: currentArticle.title,
        text: currentArticle.text,
        topic: currentArticle.topic,
      });
    } else {
      setValues(initialFormValues);
    }
  }, [currentArticle]);

  const onChange = (evt) => {
    const { id, value } = evt.target;
    setValues({ ...values, [id]: value });
  };

  const onSubmit = async (evt) => {
    evt.preventDefault();

    if (currentArticle) {
      try {
        await updateArticle({ article_id: currentArticle.article_id, article: values });
      } catch (error) {
        console.error("Error updating article:", error);
      }
    } else {
      try {
        console.log("values:", values);
        await postArticle(values);
      } catch (error) {
        console.error("Error posting article:", error);
      }
    }

    // Reset the form values and clear current article
    setValues(initialFormValues);
    setCurrentArticleId(null);
  };

  const isDisabled = () => {
    // ✨ implement
    // Make sure the inputs have some values
    const title = values.title.trim();
    const text = values.text.trim();
    const topic = values.topic.trim();
    if (title.length > 0 && text.length > 0 && topic.length > 0) {
      return false;
    }
    return true;
  };

  const cancelEdit = () => {
    setCurrentArticleId(null);
    setValues(initialFormValues);
  };

  return (
    // ✨ fix the JSX: make the heading display either "Edit" or "Create"
    // and replace Function.prototype with the correct function
    <form id="form" onSubmit={onSubmit}>
      <h2>{currentArticle ? "Edit" : "Create"} Article</h2>
      <input maxLength={50} onChange={onChange} value={values.title} placeholder="Enter title" id="title" />
      <textarea maxLength={200} onChange={onChange} value={values.text} placeholder="Enter text" id="text" />
      <select onChange={onChange} id="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        <button disabled={isDisabled()} id="submitArticle">
          Submit
        </button>
        <button onClick={cancelEdit}>Cancel edit</button>
      </div>
    </form>
  );
}

// 🔥 No touchy: ArticleForm expects the following props exactly:
ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({
    // can be null or undefined, meaning "create" mode (as opposed to "update")
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  }),
};
