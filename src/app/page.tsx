"use client";
import React, { useState, useEffect } from "react";
import { OpenAI } from "openai";
import styles from "./page.module.css";
import ReactMarkdown from "react-markdown";
import { callOpenAI } from '../utils/openai'; // We'll create this utility function

interface previousChatsInterface {
  request: string | null;
  response: string | null;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<string | null>("");
  const [loading, setLoading] = useState(false);
  const [previousChats, setPreviousChats] = useState<previousChatsInterface[]>(
    []
  );

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);

    try {
      const response = await callOpenAI(query);
      setResult(response);
      setPreviousChats([
        ...previousChats,
        { request: query, response: response },
      ]);
      setQuery("");
    } catch (error) {
      console.error("Error making API call:", error);
      setResult("Sorry, there was an error processing your request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className="title">Chat</h1>
      {loading && (
        <div className="over" id="loading">
          <div className="spinner">
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
          </div>
        </div>
      )}
      <div className={styles.result}>
        {previousChats.map((chat, index) => (
          <div key={index}>
            <ReactMarkdown className={styles.req}>
              {chat.request || ""}
            </ReactMarkdown>
            <ReactMarkdown>{chat.response || ""}</ReactMarkdown>
          </div>
        ))}
      </div>

      <form className={styles.form}>
        <textarea
          className={styles.textarea}
          value={query}
          onChange={handleChange}
        />
        <button className={styles.button} onClick={handleSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
}
