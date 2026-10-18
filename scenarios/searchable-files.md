---
title: Make a chat's files searchable
goal: Find words inside the PDFs and documents people sent you, not only in the messages.
steps:
  - run: tg messages sync Team
    why: bring the chat's history in the local store up to date
  - run: tg attachments extract --chat Team --download --output-dir tg-files
    why: save the files not downloaded yet and keep their text in the local store
  - run: tg search all invoice --offline
    why: the files' text is now found with the messages, without asking Telegram
look:
  - files whose text could not be read; scans need --ocr
  - the cursor in the answer when there are more files to read
---
