class JobService {
  static listJobs() {
    return [
      {
        id: 2312,
        title: 'Product Manager',
        description: 'Manage products',
        posted: new Date('1/12/2021'),
        url: 'https://example.com/job/2312',
        city: 'Seattle',
        state: 'WA',
        country: 'USA',
      },
      {
        id: 2313,
        title: 'Python Engineer',
        description: 'Must be an expert in Django.',
        posted: new Date('1/12/2021'),
        url: 'https://example.com/job/2313',
        city: 'Seattle',
        state: 'WA',
        country: 'USA',
      },
      {
        id: 2314,
        title: 'Senior Python Engineer',
        description: 'Must be an expert in Django.',
        posted: new Date('1/12/2021'),
        url: 'https://example.com/job/2314',
        city: 'Seattle',
        state: 'WA',
        country: 'USA',
      },
    ];
  }

  static listJobsAsXML() {
    const jobs = this.listJobs().map((j) => ({
      job: [
        { title: { _cdata: j.title } },
        { description: { _cdata: j.description } },
        { date: { _cdata: j.posted } },
        { referenceNumber: { _cdata: j.id } },
        { url: { _cdata: j.url } },
        { company: { _cdata: 'US Robotics and Mechanical Men' } },
        { sourceName: { _cdata: 'Apple' } },
        { city: { _cdata: j.city } },
        { state: { _cdata: j.state } },
        { country: { _cdata: j.country } },
        { email: { _cdata: 'your_email@your_company.com' } },
        { metadata: { _cdata: '' } },
      ],
    }));

    return [
      {
        source: [
          { publisher: 'Superhero ATS' },
          { publisherurl: 'https://example.com' },
          { lastBuildDate: Date() },
          ...jobs,
        ],
      },
    ];
  }

  static getJob(jobId) {
    return this.listJobs().find((j) => j.id === jobId);
  }
}

module.exports = JobService;
