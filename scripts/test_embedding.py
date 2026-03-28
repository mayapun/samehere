from sentence_transformers import SentenceTransformer

model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

text = "I have been feeling overwhelmed and alone lately."
embedding = model.encode(text)

print("Text:", text)
print("Dimensions:", len(embedding))
print("First 5 values:", embedding[:5])