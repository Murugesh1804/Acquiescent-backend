import JobOpening from '../models/JobOpening.js';

export const createJobOpening = async (req, res) => {
  try {
    const newJob = new JobOpening(req.body);
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create job opening', error });
  }
};

export const getAllJobOpenings = async (req, res) => {
  try {
    const jobs = await JobOpening.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch jobs', error });
  }
};

export const getJobBySlug = async (req, res) => {
  try {
    const job = await JobOpening.findOne({ slug: req.params.slug });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch job', error });
  }
};

export const updateJobOpening = async (req, res) => {
    try {
      const updatedJob = await JobOpening.findOneAndUpdate(
        { slug: req.params.slug },
        { $set: req.body },
        { new: true, runValidators: true }
      );
  
      if (!updatedJob) {
        return res.status(404).json({ message: 'Job not found' });
      }
  
      res.status(200).json(updatedJob);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update job opening', error });
    }
  };

  export const deleteJobOpening = async (req, res) => {
    try {
      const deletedJob = await JobOpening.findOneAndDelete({ slug: req.params.slug });
  
      if (!deletedJob) {
        return res.status(404).json({ message: 'Job not found' });
      }
  
      res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete job opening', error });
    }
  };
  