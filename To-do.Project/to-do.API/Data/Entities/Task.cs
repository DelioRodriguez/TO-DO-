﻿namespace to_do.API.Data.Entities
{
    public class Task
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public bool IsCompleted { get; set; }
    }
}
